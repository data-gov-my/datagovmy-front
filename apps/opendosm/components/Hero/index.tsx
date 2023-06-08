import { FunctionComponent } from "react";

import Container from "@components/Container";

type HeroProps = {
  background?: string;
  className?: string;
  children: React.ReactNode;
};

const Hero: FunctionComponent<HeroProps> = ({ background = "bg-washed", className, children }) => {
  return (
    <Container background={background} className={`py-12 ${className}`}>
      {children}
    </Container>
  );
};

export default Hero;
