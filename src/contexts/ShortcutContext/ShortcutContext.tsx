import React, { ReactNode, useContext, useEffect, useRef } from "react";
import { Char } from "../../types/Char";

type Key = Char | "CtrlCmd" | "Shift" | "Alt";

type ShortcutCallback = () => void;
type ShortcutKeys = Array<Key>;

type ShortcutMap = {
  [key: string]: ShortcutCallback;
};

type ContextValue = {
  shortcuts: ShortcutMap;
};

const ShortcutContext = React.createContext<ContextValue>({
  shortcuts: {},
});

type Props = {
  /**
   * The child element to render with the context values passed down. This
   * should probably be your entire application, or close to it.
   */
  children: ReactNode;
};
/**
 * Provide support for the useShortcut hook throughout your application.
 */
function ShortcutProvider({ children }: Props) {
  const shortcuts = useRef<ShortcutMap>({}).current;

  // Keeps track of all of the keys pressed at a given instant
  const pressed = useRef<Set<string>>(new Set([]));

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key.length === 1) {
      // A letter was pressed
      pressed.current.add(event.key.toUpperCase());
    } else if (event.key === "Control" || event.metaKey) {
      // metaKey is the command key on macs
      pressed.current.add("CtrlCmd");
    } else if (event.key === "Shift") {
      pressed.current.add("Shift");
    } else if (event.key === "Alt") {
      pressed.current.add("Alt");
    }
  };

  const handleKeyup = () => {
    // As soon as one key has been released, treat it as the end of the
    // keyboard shortcut (this is the default browser behavior) and grab
    // all pressed keys, sort them, and see if we have a matching shortcut.
    // Fail silently if there is no such shortcut (user may have just made
    // an error/been alt-tabbing/etc).
    const sortedKeys = Array.from(pressed.current).sort();
    pressed.current = new Set();
    const keysAsString = sortedKeys.join("+");
    if (keysAsString in shortcuts) {
      shortcuts[keysAsString]();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyup);

    return () => {
      // stop listening for keyboard events on unmount
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("keyup", handleKeyup);
    };
  });

  return (
    <ShortcutContext.Provider value={{ shortcuts }}>
      {children}
    </ShortcutContext.Provider>
  );
}

/**
 * Listens for the provided sequence of keys and executes callback when they
 * are pressed. Throws an error if the sequence of keys has already been
 * registered.
 *
 * @param keys the keys to listen for
 * @param callback function to execute once the keys have been pressed
 */
function useShortcut(keys: ShortcutKeys, callback: ShortcutCallback) {
  const { shortcuts } = useContext(ShortcutContext);
  const keysAsString = keys.sort().join("+");
  if (keysAsString in shortcuts) {
    throw new Error(
      "You have already registered the keyboard shortcut " + keys.join("+")
    );
  } else {
    shortcuts[keysAsString] = callback;
  }
}

export { ShortcutProvider, useShortcut };
