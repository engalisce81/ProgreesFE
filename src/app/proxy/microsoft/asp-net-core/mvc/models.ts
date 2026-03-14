
export interface ActionResult {
}

export interface ContentResult extends ActionResult {
  content?: string;
  contentType?: string;
  statusCode?: number;
}
