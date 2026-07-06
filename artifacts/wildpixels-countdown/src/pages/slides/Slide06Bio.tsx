import CountdownSlide from "@/components/CountdownSlide";

export default function Slide06Bio() {
  return (
    <CountdownSlide
      image="https://lh3.googleusercontent.com/pw/AP1GczOLYowST2soOmh0YEsQDumlHVMFDhptWzlTe6lh27y0qPqHBQLv9m20KyjSEq7JXlWbT_LR4z1PV7141BUce5ZEIVNruopYacYT7NOMGmnaxE3t6I-U=w1920"
      alt="One-horned rhino, Kaziranga"
      kicker="Wildpixels · Coming Soon"
      lines={[{ text: "Meet the Man" }, { text: "Behind the Lens", accent: true }]}
      subtext="A closer look at who's been out there before sunrise, waiting for the right light."
      page="06"
    />
  );
}
