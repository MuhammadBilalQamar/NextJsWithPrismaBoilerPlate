'use client';
import Image from 'next/image';
import React from 'react';
import { useEffect, useState } from 'react';

const TestimonialSlider = ({ testimonials }: any) => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [data, setData] = React.useState<any>(null);

  const totalLength = testimonials?.length;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    setWindowWidth(window.innerWidth);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    if (testimonials && testimonials.length) {
      setData(testimonials)
    }
  }, [testimonials])

  useEffect(() => {
    const intervalId = setInterval(() => {
      next()
    }, 5000)

    return () => {
      clearInterval(intervalId);
    }
  }, [activeIndex])

  const next = () => {
    let nextIndex = activeIndex + 1;
    if (nextIndex === totalLength) {
      nextIndex = 0;
    }
    setActiveIndex(nextIndex)
  };

  // const previous = () => {
  //   let prevIndex = activeIndex - 1;
  //   if (prevIndex < 0) {
  //     // if first, go to last
  //     prevIndex = totalLength - 1;
  //   }
  //   setActiveIndex(prevIndex)
  // };

  const StarReview = () => {
    return (
      <div className="home-client-center">
        <a href="#">
          <Image
            width={15}
            height={15}
            src="/images/home/client-review-star-fill.png"
            alt="Client 3"
          />
        </a>
        <a href="#">
          <Image
            width={15}
            height={15}
            src="/images/home/client-review-star-fill.png"
            alt="Client 3"
          />
        </a>
        <a href="#">
          <Image
            width={15}
            height={15}
            src="/images/home/client-review-star-fill.png"
            alt="Client 3"
          />
        </a>
        <a href="#">
          <Image
            width={15}
            height={15}
            src="/images/home/client-review-star-fill.png"
            alt="Client 3"
          />
        </a>
        <a href="#">
          <Image
            width={15}
            height={15}
            src="/images/home/client-review-star-unfill.png"
            alt="Client 3"
          />
        </a>
      </div>
    )
  }
  return (
    <>
      <div className="home-client" >
        <div className="home-client-flex">
          {data?.map((item: any, index: number) => (
            <div style={{ width: windowWidth >= 768 ? '163px !important' : '120px !important', height: windowWidth >= 768 ? '163px !important' : '120px !important' }} className={activeIndex === index ? 'home-client-box-active' : 'home-client-box'} key={item.id} >
              <Image
                style={{ paddingTop: windowWidth < 768 && activeIndex === index ? '4px' : '', paddingBottom: windowWidth < 768 && activeIndex === index ? '4px' : '', objectFit: "cover", borderRadius: '100%' }}
                width={windowWidth >= 768 && activeIndex === index ? 150 : windowWidth >= 768 && activeIndex !== index ? 87 : windowWidth < 768 && activeIndex === index ? 100 : windowWidth < 768 && activeIndex !== index ? 80 : 10}
                height={windowWidth >= 768 && activeIndex === index ? 150 : windowWidth >= 768 && activeIndex !== index ? 87 : windowWidth < 768 && activeIndex === index ? 100 : windowWidth < 768 && activeIndex !== index ? 80 : 10}
                className="circular-image"
                src={item.imageUrl}
                alt="Client 1"
              />
            </div>
          ))}
        </div>
      </div>

      {/*ACTIVE CLIENT NAME */}
      <div className="home-client-name">
        <h4>{testimonials[activeIndex].name}</h4>
      </div>
      <div className="home-client-dflex">
        <Image
          width={15}
          height={15}
          src="/images/home/client-left-style.png"
          alt="Client 3"
        />
        <Image
          width={15}
          height={15}
          src="/images/home/client-right-style.png"
          alt="Client 3"
        />
      </div>
      <div className="home-client-center">
        <p className="home-client-paragraph">
          {testimonials[activeIndex].review}
        </p>
      </div>
      <StarReview />
      <div style={{ display: 'flex', marginTop: '30px', alignItems: 'center', justifyContent: 'center' }}>
        {data?.map((item: any, index: number) => (
          <div
            key={index}
            style={{
              width: index === activeIndex ? '20px' : '15px',
              height: index === activeIndex ? '20px' : '15px',
              marginInline: '3px',
              borderRadius: '50%',
              backgroundColor: index === activeIndex ? '#fae2be' : '#101010',
            }}
          />
        ))}
      </div>
    </>
  );
};

export default TestimonialSlider;
