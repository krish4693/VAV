export const selectClass =
  "w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#4640DE] focus:outline-none focus:ring-1 focus:ring-[#4640DE]";
export const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-[#4640DE] focus:outline-none focus:ring-1 focus:ring-[#4640DE]";
export const labelClass = "mb-1.5 block text-sm text-gray-500";

export const JOB_ROLES = ["Frontend Developer", "Backend Developer", "Designer", "Product Manager"];
export const SALARY_TYPES = ["Monthly", "Yearly", "Hourly"];
export const EDUCATION = ["High School", "Bachelor's", "Master's", "PhD", "Graduation"];
export const EXPERIENCE = ["Entry Level", "Mid Level", "Senior Level", "1-2 years", "3-5 years", "5+ years"];
export const JOB_TYPES = ["Full Time", "Part Time", "Contract", "Internship"];
export const JOB_LEVELS = ["Entry Level", "Junior", "Mid", "Senior", "Lead"];
export const COUNTRIES = ["India", "United States", "United Kingdom", "Canada", "Australia"];
export const CITIES = ["Bangalore", "Mumbai", "New York", "London"];

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-base font-semibold text-gray-900">{children}</h2>;
}

export function SelectField({
  label,
  id,
  options,
  value,
  onChange,
}: {
  label: string;
  id: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <select
        id={id}
        className={selectClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export function DateField({
  label,
  id,
  value,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input
        id={id}
        type="date"
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export interface JobFormData {
  title: string;
  tags: string;
  jobRole: string;
  minSalary: string;
  maxSalary: string;
  salaryType: string;
  educationLevel: string;
  experienceLevel: string;
  jobType: string;
  jobLevel: string;
  expirationDate: string;
  country: string;
  city: string;
  fullyRemote: boolean;
  description: string;
}

export const emptyForm: JobFormData = {
  title: "",
  tags: "",
  jobRole: "",
  minSalary: "",
  maxSalary: "",
  salaryType: "",
  educationLevel: "",
  experienceLevel: "",
  jobType: "",
  jobLevel: "",
  expirationDate: "",
  country: "",
  city: "",
  fullyRemote: false,
  description: "",
};
