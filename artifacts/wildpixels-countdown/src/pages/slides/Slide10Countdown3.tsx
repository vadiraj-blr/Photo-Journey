import CountdownSlide from "@/components/CountdownSlide";

export default function Slide10Countdown3() {
  return (
    <CountdownSlide
      image="https://lh3.googleusercontent.com/pw/AP1GczPcuDzMvxX__qXg307tUxWEYSqAHqegUWiJ7YPVa9vuuDLI4K8THVgn16RPJSwJElCpPD-bw0RaS6Typ8Yn0_8E56-0K30jINqhn-2YwfUy2I9DbExH=w1920"
      alt="Kaziranga expedition"
      kicker="Wildpixels · Coming Soon"
      lines={[{ text: "3", accent: true }]}
      subtext="Days. The wait is almost over."
      page="10"
      numeral
    />
  );
}
