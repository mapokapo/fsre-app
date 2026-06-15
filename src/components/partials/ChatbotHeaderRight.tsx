import Dots from "@/components/Dots";

export type ChatbotHeaderRightProps = {
  isAnimating: boolean;
};

export default function ChatbotHeaderRight({
  isAnimating,
}: Readonly<ChatbotHeaderRightProps>) {
  return <Dots isAnimating={isAnimating} />;
}
