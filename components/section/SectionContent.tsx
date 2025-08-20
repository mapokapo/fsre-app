import { PropsWithChildren } from "react";

export type SectionContentProps = PropsWithChildren;

export default function SectionContent({ children }: SectionContentProps) {
  return children;
}
