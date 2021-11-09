import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Char } from "../../types/Char";

type Key = Char | "CtrlCmd" | "Shift" | "Alt";

type Shortcut = {
  keys: Array<Key>;
  callback: () => void;
};

type ShortcutMap = {
  [key: string]: () => void;
};

type ContextValue = {
  shortcuts: ShortcutMap;
  shortcutRegistry: Set<Array<Key>>;
};

const ShortcutContext = React.createContext<ContextValue>({
  shortcuts: {},
  shortcutRegistry: new Set([]),
});

type Props = {
  children: ReactNode;
};
function ShortcutProvider({ children }: Props) {
  const shortcutRegistry = useRef<Set<Array<Key>>>(new Set([])).current;
  const shortcuts = useRef<ShortcutMap>({}).current;

  useEffect(() => {});

  return (
    <ShortcutContext.Provider value={{ shortcuts, shortcutRegistry }}>
      {children}
    </ShortcutContext.Provider>
  );
}

function useShortcut({ keys, callback }: Shortcut) {
  const { shortcuts, shortcutRegistry } = useContext(ShortcutContext);
  const sortedKeys = keys.sort();
  if (shortcutRegistry.has(sortedKeys)) {
    throw new Error(
      "You have already registered the keyboard shortcut " + keys.join("+")
    );
  } else {
    shortcuts[sortedKeys.join("")] = callback;
  }
}

export { ShortcutProvider, useShortcut };
