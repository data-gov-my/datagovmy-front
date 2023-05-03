import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { clx } from "@lib/helpers";
import React, { ForwardedRef, ReactNode } from "react";
import Slider from "react-slick";

type CarouselProps = {
  items: Array<ReactNode>;
  itemsToShow: number;
  itemsToScroll: number;
  title?: string | ReactNode;
  _ref?: ForwardedRef<Slider>;
};

const Carousel = ({ items, itemsToShow, itemsToScroll, title, _ref }: CarouselProps) => {
  const PrevArrow = ({ ...props }) => {
    const { onClick } = props;
    return (
      <button className="absolute inset-y-0 left-0 z-10 lg:-left-8" onClick={onClick}>
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
    );
  };

  const NextArrow = ({ ...props }) => {
    const { onClick } = props;
    return (
      <button className="absolute inset-y-0 right-0 z-10 lg:-right-8" onClick={onClick}>
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    );
  };

  const settings = {
    dots: false,
    infinite: true,
    cssEase: "ease-in-out",
    speed: 500,
    slidesToShow: items.length < itemsToShow ? items.length : itemsToShow,
    slidesToScroll: itemsToScroll,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          {title && typeof title === "string" ? (
            <span className="text-base font-bold dark:text-white">{title}</span>
          ) : (
            title
          )}
        </div>
      </div>
      <Slider ref={_ref} {...settings}>
        {items.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
