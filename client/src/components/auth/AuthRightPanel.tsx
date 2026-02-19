import Image from "next/image";

export default function AuthRightPanel() {
  return (
    <div className="relative hidden md:block md:w-1/2">
      <Image
        src="/image.png"
        alt="People collaborating at work"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
