import CountdownSlide from "@/components/CountdownSlide";

export default function Slide02Origin() {
  return (
    <CountdownSlide
      image="https://lh3.googleusercontent.com/pw/AP1GczMaUtfe0CJKYmhm681RJshtoRfI4hzcs8nWQY9wKkyewAyEQ9esShUffZl5qRrEVquocwosfRSt6tqus6bv5T_jlJjTpjnccbApExhp5B0cIBpHRZoO=w1920"
      alt="Kabini jungle at dawn"
      kicker="Wildpixels · Coming Soon"
      lines={[{ text: "Two Years." }, { text: "One Obsession.", accent: true }]}
      subtext="Vadiraj has spent two years chasing India's wildlife across its forests, grasslands, and wetlands — before dawn, every time."
      page="02"
    />
  );
}
