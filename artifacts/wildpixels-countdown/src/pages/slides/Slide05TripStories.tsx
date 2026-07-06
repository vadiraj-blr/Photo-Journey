import CountdownSlide from "@/components/CountdownSlide";

export default function Slide05TripStories() {
  return (
    <CountdownSlide
      image="https://lh3.googleusercontent.com/pw/AP1GczOuhNFdUODfz4zADEoGPpnoCr6RQW2Z3PchNFm8wXW0sxrMPAK0livXZa5igzcLufamu3tzlOpn7W4niQaCn1xQYD3zYtXljPpHQJln5WjtPbdi3Y3X=w1920"
      alt="Himalayan Monal"
      kicker="Wildpixels · Coming Soon"
      lines={[{ text: "Every Trip Gets" }, { text: "Its Story", accent: true }]}
      subtext="Not just galleries — full field reports from each expedition, in Vadiraj's own words."
      page="05"
    />
  );
}
