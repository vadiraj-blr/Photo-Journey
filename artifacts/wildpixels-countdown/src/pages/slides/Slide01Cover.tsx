import CountdownSlide from "@/components/CountdownSlide";

export default function Slide01Cover() {
  return (
    <CountdownSlide
      image="https://lh3.googleusercontent.com/pw/AP1GczOSWkv8ygk7qOG4wCKZBDZQSQHbWA618IcemAOTYIqJbkHyNZG_nc7iTpGI1C_UWXc-ZSvPCzH9l82qHsYQFVCZA6PeztNRnBH14P9QBmK_3nnA7Cwu=w1920"
      alt="F2 tigress and cubs, Tadoba"
      kicker="Wildpixels · Coming Soon"
      lines={[{ text: "Something Wild" }, { text: "Is Coming", accent: true }]}
      subtext="A new home for India's wild places is about to open."
      page="01"
    />
  );
}
