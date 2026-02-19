import Image from "next/image";

export default function AuthLogo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.svg" alt="JobPilot" width={32} height={32} />
      <span className="text-xl font-bold text-gray-900">JobPilot</span>
    </div>
  );
}
