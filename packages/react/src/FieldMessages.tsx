import type { ValidationMessage } from "@humaneforms/core";

export interface FieldMessagesProps {
  messages: ValidationMessage[];
}

/** Unstyled message list. Consumers style via [data-humaneforms] / [data-severity]. */
export function FieldMessages({ messages }: FieldMessagesProps) {
  if (messages.length === 0) return null;
  return (
    <ul data-humaneforms="messages">
      {messages.map((m) => (
        <li key={m.code} data-severity={m.severity}>
          {m.message}
        </li>
      ))}
    </ul>
  );
}
