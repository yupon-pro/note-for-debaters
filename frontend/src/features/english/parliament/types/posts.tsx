export type PostingProps = {
  content: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export type PostData = {
  [key: string]: PostingProps
}
