export interface JobPost {
  id: number;
  workType: ("On-site" | "Remote" | "Hybrid")[];
  level: ("Intern" | "Fresher" | "Middle" | "Senior" | "Associate")[];
  majors: ("IT" | "Marketing" | "Sales" | "HR")[];
  categories: ("Front-end" | "Back-end" | "DevOps" | "Sales" | "DA" | "BA")[];
  skills: ("Java" | "Python" | "React" | "SQL")[];
  company: "FPT" | "CMC" | "Like Lion" | "Viettel" | "VNPT"; // chỉ đc chọn 1
  title: string;
  datePost: Date;
  salary: string;
  description: string;
  location_city: (
    | "Hồ Chí Minh"
    | "Hà Nội"
    | "Đà Nẵng"
    | "Cần Thơ"
    | "Nha Trang"
  )[];
  location_ward: string;
  expired_date: Date;
}

export const mockJob: JobPost[] = [
  {
    id: 1,
    workType: ["On-site"],
    level: ["Intern", "Fresher"],
    majors: ["IT"],
    categories: ["Back-end", "Front-end"],
    skills: ["Java", "React"],
    company: "Like Lion",
    title: "This is title 1",
    datePost: new Date("2025-07-10"),
    expired_date: new Date("2025-08-10"),
    salary: "Negotiate",
    description: "This is description 1",
    location_city: ["Hồ Chí Minh", "Cần Thơ", "Hà Nội"],
    location_ward: "Phường 1"
  },
  {
    id: 2,
    workType: ["Remote", "Hybrid"],
    level: ["Middle"],
    majors: ["Marketing"],
    categories: ["Sales"],
    skills: ["SQL"],
    company: "FPT",
    title: "This is title 2",
    datePost: new Date("2025-07-12"),
    expired_date: new Date("2025-08-12"),
    salary: "Negotiate",
    description: "This is description 2",
    location_city: ["Đà Nẵng", "Hồ Chí Minh"],
    location_ward: "Phường 7"
  },
  {
    id: 3,
    workType: ["Hybrid"],
    level: ["Senior"],
    majors: ["Sales"],
    categories: ["BA", "Sales"],
    skills: ["Java"],
    company: "CMC",
    title: "This is title 3",
    datePost: new Date("2025-07-08"),
    expired_date: new Date("2025-08-08"),
    salary: "Negotiate",
    description: "This is description 3",
    location_city: ["Hà Nội"],
    location_ward: "Phường 3"
  },
  {
    id: 4,
    workType: ["On-site"],
    level: ["Associate"],
    majors: ["HR"],
    categories: ["DevOps"],
    skills: ["Python", "SQL"],
    company: "Viettel",
    title: "This is title 4",
    datePost: new Date("2025-07-01"),
    expired_date: new Date("2025-08-01"),
    salary: "Negotiate",
    description: "This is description 4",
    location_city: ["Nha Trang", "Đà Nẵng"],
    location_ward: "Phường 6"
  },
  {
    id: 5,
    workType: ["Remote"],
    level: ["Fresher"],
    majors: ["IT", "Marketing"],
    categories: ["Front-end"],
    skills: ["React"],
    company: "VNPT",
    title: "This is title 5",
    datePost: new Date("2025-07-11"),
    expired_date: new Date("2025-08-11"),
    salary: "Negotiate",
    description: "This is description 5",
    location_city: ["Cần Thơ"],
    location_ward: "Phường 2"
  },
  {
    id: 6,
    workType: ["On-site", "Hybrid"],
    level: ["Intern", "Associate"],
    majors: ["HR"],
    categories: ["BA", "Sales"],
    skills: ["SQL"],
    company: "Like Lion",
    title: "This is title 6",
    datePost: new Date("2025-07-06"),
    expired_date: new Date("2025-08-06"),
    salary: "Negotiate",
    description: "This is description 6",
    location_city: ["Hồ Chí Minh", "Hà Nội"],
    location_ward: "Phường 5"
  },
  {
    id: 7,
    workType: ["Remote"],
    level: ["Middle", "Senior"],
    majors: ["IT"],
    categories: ["Back-end", "DevOps"],
    skills: ["Python", "Java"],
    company: "FPT",
    title: "This is title 7",
    datePost: new Date("2025-07-13"),
    expired_date: new Date("2025-08-13"),
    salary: "Negotiate",
    description: "This is description 7",
    location_city: ["Đà Nẵng"],
    location_ward: "Phường 9"
  },
  {
    id: 8,
    workType: ["On-site"],
    level: ["Fresher"],
    majors: ["Sales", "Marketing"],
    categories: ["Sales"],
    skills: ["SQL"],
    company: "CMC",
    title: "This is title 8",
    datePost: new Date("2025-07-05"),
    expired_date: new Date("2025-08-05"),
    salary: "Negotiate",
    description: "This is description 8",
    location_city: ["Cần Thơ", "Hồ Chí Minh"],
    location_ward: "Phường 8"
  },
  {
    id: 9,
    workType: ["Hybrid"],
    level: ["Intern"],
    majors: ["IT"],
    categories: ["Front-end", "BA"],
    skills: ["React"],
    company: "Viettel",
    title: "This is title 9",
    datePost: new Date("2025-07-09"),
    expired_date: new Date("2025-08-09"),
    salary: "Negotiate",
    description: "This is description 9",
    location_city: ["Nha Trang"],
    location_ward: "Phường 4"
  },
  {
    id: 10,
    workType: ["Remote", "On-site"],
    level: ["Senior"],
    majors: ["Marketing"],
    categories: ["DevOps"],
    skills: ["Python", "SQL"],
    company: "VNPT",
    title: "This is title 10",
    datePost: new Date("2025-07-03"),
    expired_date: new Date("2025-08-03"),
    salary: "Negotiate",
    description: "This is description 10",
    location_city: ["Hà Nội"],
    location_ward: "Phường 10"
  },
  {
    id: 11,
    workType: ["On-site"],
    level: ["Associate", "Middle"],
    majors: ["HR", "IT"],
    categories: ["BA", "DevOps"],
    skills: ["Java", "SQL"],
    company: "FPT",
    title: "This is title 11",
    datePost: new Date("2025-07-07"),
    expired_date: new Date("2025-08-07"),
    salary: "Negotiate",
    description: "This is description 11",
    location_city: ["Hồ Chí Minh"],
    location_ward: "Phường 11"
  },
  {
    id: 12,
    workType: ["Remote"],
    level: ["Intern"],
    majors: ["IT"],
    categories: ["Front-end"],
    skills: ["React", "Java"],
    company: "VNPT",
    title: "This is title 12",
    datePost: new Date("2025-07-04"),
    expired_date: new Date("2025-08-04"),
    salary: "Negotiate",
    description: "This is description 12",
    location_city: ["Đà Nẵng"],
    location_ward: "Phường 12"
  },
  {
    id: 13,
    workType: ["Hybrid", "Remote"],
    level: ["Fresher", "Middle"],
    majors: ["Sales"],
    categories: ["Sales", "BA"],
    skills: ["SQL"],
    company: "Like Lion",
    title: "This is title 13",
    datePost: new Date("2025-07-02"),
    expired_date: new Date("2025-08-02"),
    salary: "Negotiate",
    description: "This is description 13",
    location_city: ["Cần Thơ"],
    location_ward: "Phường 13"
  },
  {
    id: 14,
    workType: ["On-site"],
    level: ["Senior"],
    majors: ["Marketing"],
    categories: ["DevOps"],
    skills: ["Python"],
    company: "Viettel",
    title: "This is title 14",
    datePost: new Date("2025-07-14"),
    expired_date: new Date("2025-08-14"),
    salary: "Negotiate",
    description: "This is description 14",
    location_city: ["Nha Trang", "Đà Nẵng"],
    location_ward: "Phường 14"
  },
  {
    id: 15,
    workType: ["Remote"],
    level: ["Associate"],
    majors: ["IT"],
    categories: ["Back-end", "BA"],
    skills: ["Java", "React"],
    company: "CMC",
    title: "This is title 15",
    datePost: new Date("2025-07-15"),
    expired_date: new Date("2025-08-15"),
    salary: "Negotiate",
    description: "This is description 15",
    location_city: ["Hà Nội", "Hồ Chí Minh"],
    location_ward: "Phường 15"
  }
];
