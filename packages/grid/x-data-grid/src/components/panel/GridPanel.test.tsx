import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/monorepo/test/utils';
import {
  GridPanel,
  gridPanelClasses as classes,
  useGridApiRef,
  GridApiContext,
  gridClasses,
} from '@mui/x-data-grid';
import { GridRootPropsContext } from '@mui/x-data-grid/context/GridRootPropsContext';
import Popper from '@mui/material/Popper';

describe('<GridPanel />', () => {
  const { render } = createRenderer();

  function Wrapper(props: { children: React.ReactNode }) {
    // mock rootProps
    const rootProps = React.useMemo(() => ({}), []);
    const apiRef = useGridApiRef();
    apiRef.current.rootElementRef = {
      // @ts-ignore
      current: document.body,
    };

    return (
      <GridRootPropsContext.Provider value={rootProps}>
        <GridApiContext.Provider value={apiRef} {...props} />
      </GridRootPropsContext.Provider>
    );
  }

  describeConformance(<GridPanel disablePortal open />, () => ({
    classes: classes as any,
    inheritComponent: Popper,
    muiName: 'MuiGridPanel',
    render: (node: React.ReactElement) => render(<Wrapper>{node}</Wrapper>),
    wrapMount:
      (baseMount: (node: React.ReactElement) => import('enzyme').ReactWrapper) =>
      (node: React.ReactNode) => {
        const wrapper = baseMount(
          <Wrapper>
            <div className={gridClasses.columnHeaders} />
            <span>{node}</span>
          </Wrapper>,
        );
        return wrapper.find('span').childAt(0);
      },
    refInstanceof: window.HTMLDivElement,
    only: ['mergeClassName', 'propsSpread', 'refForwarding', 'rootClass'],
  }));
});
