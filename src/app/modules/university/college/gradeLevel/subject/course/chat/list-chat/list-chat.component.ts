// list-chat.component.ts
import { CoreModule, ConfigStateService } from '@abp/ng.core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '@proxy/dev/acadmy/chats';
import { CreateUpdateChatMessageDto } from '@proxy/dev/acadmy/dtos/request/chats';
import { ChatMessageDto } from '@proxy/dev/acadmy/dtos/response/chats';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-list-chat',
  standalone: true,
  imports: [CoreModule, CommonModule, NgIf, NgFor, FormsModule],
  templateUrl: './list-chat.component.html',
  styleUrl: './list-chat.component.scss'
})
export class ListChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages: ChatMessageDto[] = [];
  newMessage: string = '';
  currentUserId: string = '';
  loading = false;
  sending = false;

  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalCount = 0;
  hasMoreMessages = true;
  isLoadingMore = false;

  // التعديل
  editingMessageId: string | null = null;

  // تحديد نوع المحادثة
  chatType: 'user' | 'group' = 'user';   // افتراضي: فردي
  targetUserId: string | null = null;
  groupId: string | null = null;

  private initialLoad = true;
  private destroy$ = new Subject<void>();
  currentUserRoles: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private configState: ConfigStateService
  ) {
    const currentUser = this.configState.getOne("currentUser");
    this.currentUserId = currentUser.id;
    this.currentUserRoles = currentUser.roles || [];
  }

  ngOnInit(): void {
    // الاستماع لتغيرات المسار (params + queryParams)
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        // نفترض وجود userId أو groupId في الـ params
        if (params['userId']) {
          this.chatType = 'user';
          this.targetUserId = params['userId'];
          this.groupId = null;
        } else if (params['groupId']) {
          this.chatType = 'group';
          this.groupId = params['groupId'];
          this.targetUserId = null;
        } else {
          // لو ما فيش، نستخدم id مع query param ?type=group أو type=user
          // سنقرأ من queryParams
          this.route.queryParams.subscribe(query => {
            const id = params['id'];
            if (query['type'] === 'group') {
              this.chatType = 'group';
              this.groupId = id;
              this.targetUserId = null;
            } else {
              this.chatType = 'user';
              this.targetUserId = id;
              this.groupId = null;
            }
            this.resetPagination();
            this.loadMessages();
          });
          return;
        }
        this.resetPagination();
        this.loadMessages();
      });
  }

  ngAfterViewChecked() {
    if (this.initialLoad && this.messages.length > 0) {
      this.scrollToBottom();
      this.initialLoad = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetPagination() {
    this.currentPage = 1;
    this.totalCount = 0;
    this.hasMoreMessages = true;
    this.messages = [];
    this.initialLoad = true;
  }

  loadMessages() {
    this.loading = true;
    // تمرير القيم المناسبة حسب نوع المحادثة
    this.chatService.getChatHistory(
      this.targetUserId,     // targetUserId
      this.groupId,          // groupId
      '',                    // search (يمكن إضافته لاحقاً)
      this.currentPage,
      this.pageSize
    ).pipe(
      finalize(() => this.loading = false),
      takeUntil(this.destroy$)
    ).subscribe(res => {
      if (res.items && res.items.length > 0) {
        const reversedItems = [...res.items]; // من الأقدم للأحدث

        if (this.currentPage === 1) {
          this.messages = reversedItems;
          setTimeout(() => this.scrollToBottom(), 100);
        } else {
          this.messages = [...reversedItems, ...this.messages];
        }

        this.totalCount = res.totalCount || 0;
        this.hasMoreMessages = this.messages.length < this.totalCount;
      } else {
        // لو مفيش رسائل، نضمن أن hasMoreMessages = false
        this.hasMoreMessages = false;
      }
    });
  }

  loadMoreMessages() {
    if (this.isLoadingMore || !this.hasMoreMessages) return;

    this.isLoadingMore = true;
    this.currentPage++;

    const currentScrollHeight = this.scrollContainer.nativeElement.scrollHeight;

    this.chatService.getChatHistory(
      this.targetUserId,
      this.groupId,
      '',
      this.currentPage,
      this.pageSize
    ).pipe(
      finalize(() => this.isLoadingMore = false),
      takeUntil(this.destroy$)
    ).subscribe(res => {
      if (res.items && res.items.length > 0) {
        const reversedItems = [...res.items];
        this.messages = [...reversedItems, ...this.messages];
        this.totalCount = res.totalCount || 0;
        this.hasMoreMessages = this.messages.length < this.totalCount;

        setTimeout(() => {
          const newScrollHeight = this.scrollContainer.nativeElement.scrollHeight;
          this.scrollContainer.nativeElement.scrollTop = newScrollHeight - currentScrollHeight;
        }, 0);
      } else {
        this.hasMoreMessages = false;
      }
    });
  }

  send() {
    if (!this.newMessage.trim() || this.sending) return;

    const input: CreateUpdateChatMessageDto = {
      text: this.newMessage,
      receiverId: this.chatType === 'user' ? this.targetUserId! : undefined,
      groupId: this.chatType === 'group' ? this.groupId! : undefined
    };

    this.sending = true;

    if (this.editingMessageId) {
      // تعديل رسالة موجودة
      this.chatService.editMessage(this.editingMessageId ,input.text)
        .pipe(
          finalize(() => {
            this.sending = false;
            this.editingMessageId = null;
          }),
          takeUntil(this.destroy$)
        )
        .subscribe(updatedMsg => {
          const index = this.messages.findIndex(m => m.id === this.editingMessageId);
          if (index !== -1) this.messages[index] = updatedMsg.data;
          this.newMessage = '';
        });
    } else {
      // إرسال رسالة جديدة
      this.chatService.sendMessage(input)
        .pipe(
          finalize(() => this.sending = false),
          takeUntil(this.destroy$)
        )
        .subscribe(msg => {
          this.messages.push(msg.data);
          this.newMessage = '';
          this.totalCount++;
          setTimeout(() => this.scrollToBottom(), 100);
        });
    }
  }

  // دوال الصلاحيات (كما هي)
  canDeleteMessage(msg: ChatMessageDto): boolean {
    if (msg.senderId === this.currentUserId) return true;
    if (this.isAdmin()) return true;
    return false;
  }

  isAdmin(): boolean {
    return this.currentUserRoles.some(role => role.toLowerCase().includes('admin'));
  }

  canEditMessage(msg: ChatMessageDto): boolean {
    return msg.senderId === this.currentUserId;
  }

  startEdit(msg: ChatMessageDto) {
    this.editingMessageId = msg.id;
    this.newMessage = msg.text;
  }

  cancelEdit() {
    this.editingMessageId = null;
    this.newMessage = '';
  }

  deleteMsg(id: string) {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      this.chatService.deleteMessage(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.messages = this.messages.filter(m => m.id !== id);
          this.totalCount = Math.max(0, this.totalCount - 1);
          this.hasMoreMessages = this.messages.length < this.totalCount;
        });
    }
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        const element = this.scrollContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }, 0);
    } catch (err) {}
  }

  onScroll() {
    const element = this.scrollContainer.nativeElement;
    if (element.scrollTop === 0 && this.hasMoreMessages && !this.isLoadingMore) {
      this.loadMoreMessages();
    }
  }
}