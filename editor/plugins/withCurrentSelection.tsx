import React, { useContext, useRef } from 'react';

import { isEqual } from 'lodash';
import { Range } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';

export const CurrentSelectionContext = React.createContext<{
  current: Range | null;
}>({ current: null });

export function withCurrentSelection<OriginalProps>(WrappedComponent: React.ComponentType<OriginalProps>) {
  return React.forwardRef((props: OriginalProps, ref) => {
    const editor = useSlate();
    const currentSelection = useRef<Range | null>(editor.selection);
    if (ReactEditor.isFocused(editor)) {
      if (!isEqual(currentSelection.current, editor.selection)) {
        currentSelection.current = editor.selection;
      }
    }

    return (
      <CurrentSelectionContext.Provider
        value= {{
      current: currentSelection.current,
        }
  }
      >
    <WrappedComponent { ...props } ref = { ref } />
    </CurrentSelectionContext.Provider>
  );
});
}
export const useCurrentSelection = () => useContext(CurrentSelectionContext);