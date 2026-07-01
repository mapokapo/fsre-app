import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import * as Linking from "expo-linking";
import { useMemo } from "react";
import { Text } from "react-native";
import Markdown, {
  renderRules,
  type RenderRules,
} from "react-native-markdown-display";

export type MessageMarkdownProps = Readonly<{
  children: string;
}>;

const selectableMarkdownRules: RenderRules = {
  ...renderRules,
  text: (node, _children, _parent, styles, inheritedStyles = {}) => (
    <Text
      key={node.key}
      selectable
      style={[inheritedStyles, styles.text]}>
      {node.content}
    </Text>
  ),
  textgroup: (node, children, _parent, styles) => (
    <Text
      key={node.key}
      selectable
      style={styles.textgroup}>
      {children}
    </Text>
  ),
  paragraph: (node, children, _parent, styles) => (
    <Text
      key={node.key}
      selectable
      style={styles.paragraph}>
      {children}
    </Text>
  ),
  strong: (node, children, _parent, styles) => (
    <Text
      key={node.key}
      selectable
      style={styles.strong}>
      {children}
    </Text>
  ),
  em: (node, children, _parent, styles) => (
    <Text
      key={node.key}
      selectable
      style={styles.em}>
      {children}
    </Text>
  ),
  link: (node, children, _parent, styles, onLinkPress) => (
    <Text
      key={node.key}
      selectable
      accessibilityRole="link"
      style={styles.link}
      onPress={() => {
        const href = node.attributes.href as string;
        if (onLinkPress) {
          onLinkPress(href);
          return;
        }

        Linking.openURL(href);
      }}>
      {children}
    </Text>
  ),
};

export default function MessageMarkdown({ children }: MessageMarkdownProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme];

  const style = useMemo(
    () => ({
      body: {
        color: theme.secondaryForeground,
        fontSize: 16,
      },
      paragraph: {
        marginTop: 0,
        marginBottom: 8,
      },
      link: {
        color: theme.fsreGradient3,
        textDecorationLine: "underline" as const,
      },
      strong: {
        fontWeight: "bold" as const,
      },
      em: {
        fontStyle: "italic" as const,
      },
      bullet_list: {
        marginBottom: 4,
      },
      ordered_list: {
        marginBottom: 4,
      },
      list_item: {
        marginBottom: 2,
      },
    }),
    [theme]
  );

  return (
    <Markdown
      style={style}
      rules={selectableMarkdownRules}
      onLinkPress={url => {
        Linking.openURL(url);
        return false;
      }}>
      {children}
    </Markdown>
  );
}
