declare module '@theme/Heading' {
  import type {ComponentType, ReactNode} from 'react';

  type HeadingProps = {
    as?: keyof JSX.IntrinsicElements;
    children?: ReactNode;
  };

  const Heading: ComponentType<HeadingProps>;

  export default Heading;
}
