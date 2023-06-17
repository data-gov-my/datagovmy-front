import { FunctionComponent, ReactNode, createContext, useState } from "react";

interface SliderContextProps {
  play: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SliderProviderProps {
  children: (play: boolean) => ReactNode;
}

export const SliderContext = createContext<SliderContextProps>({
  play: false,
  setPlaying: () => {},
});

export const SliderProvider: FunctionComponent<SliderProviderProps> = ({ children }) => {
  const [play, setPlaying] = useState<boolean>(false);

  const contextValue: SliderContextProps = {
    play,
    setPlaying,
  };

  return <SliderContext.Provider value={contextValue}>{children(play)}</SliderContext.Provider>;
};
