import CountdownSlide from "@/components/CountdownSlide";

export default function Slide12Countdown1() {
  return (
    <CountdownSlide
      image="https://lh3.googleusercontent.com/pw/AP1GczMU3513EfyfgwBWPoRqMQXsyCGEeyTlDSal9HjJXqO5alFIS3zdj67dnbAPuzt0BI-iKdzqMbfSGRkmmJ2z_Skl-fPhJBML7xWjqfI2G_WVeFegAlFdgQUYk=w1920"
      alt="Wildpixels expedition"
      kicker="Wildpixels · Coming Soon"
      lines={[{ text: "1", accent: true }]}
      subtext="Day. Tomorrow, the forest opens to everyone."
      page="12"
      numeral
    />
  );
}
