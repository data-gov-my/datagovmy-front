import Spinner from "@components/Spinner";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import React, { ForwardedRef, FunctionComponent, ReactNode } from "react";
import Slider from "react-slick";

type CarouselProps = {
  isLoading: boolean;
  items: Array<ReactNode>;
  config?: Object;
  title?: string | ReactNode;
  _ref?: ForwardedRef<Slider>;
};

const Carousel: FunctionComponent<CarouselProps> = ({ isLoading, items, config, title, _ref }) => {
  const PrevArrow = ({ ...props }) => {
    const { onClick } = props;
    return (
      <button
        className={`hover:bg-washed dark:hover:bg-washed-dark absolute -left-2 z-10 hidden h-8
         w-8 rounded-full bg-white pl-1 dark:bg-black lg:-left-10 lg:block`}
        onClick={onClick}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
    );
  };

  const NextArrow = ({ ...props }) => {
    const { onClick } = props;
    return (
      <button
        className={`hover:bg-washed dark:hover:bg-washed-dark absolute -right-2 z-10 hidden h-8
         w-8 rounded-full bg-white pl-1.5 dark:bg-black lg:-right-10 lg:block`}
        onClick={onClick}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    );
  };

  const settings = config
    ? config
    : {
        dots: false,
        infinite: true,
        cssEase: "ease-in-out",
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
          {
            breakpoint: 1280,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
            },
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
            },
          },
          {
            breakpoint: 640,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true,
              infinite: false,
            },
          },
        ],
      };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          {title && typeof title === "string" ? (
            <span className="pb-6 text-base font-bold dark:text-white">{title}</span>
          ) : (
            title
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="flex h-24 w-full">
          <div className="mx-auto self-center">
            <Spinner loading={true} />
          </div>
        </div>
      ) : (
        <Slider ref={_ref} {...settings}>
          {items.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default Carousel;
