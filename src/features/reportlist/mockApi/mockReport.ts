export interface Reports {
    id: number;
    reportType: "Report Company" | "Report User" | "Report Post";
    description: string;
    userId: number;
    targetId: number; // ID của nội dung bị report
    createAt: Date;
    status: "True" | "False";
}

export interface Reports {
    id: number;
    reportType: "Report Company" | "Report User" | "Report Post";
    description: string;
    userId: number;
    targetId: number;
    createAt: Date;
    status: "True" | "False";
}

export const mockReport: Reports[] = [
    {
        id: 1,
        reportType: "Report Post",
        description: "Đây là bài tuyển dụng lừa đảo",
        userId: 10,
        targetId: 5,
        createAt: new Date(),
        status: "False"
    },
    {
        id: 2,
        reportType: "Report Company",
        description: "Công ty không minh bạch trong quá trình tuyển dụng",
        userId: 12,
        targetId: 3,
        createAt: new Date(),
        status: "False"
    },
    {
        id: 3,
        reportType: "Report User",
        description: "Người dùng spam tin nhắn",
        userId: 11,
        targetId: 21,
        createAt: new Date(),
        status: "False"
    },
    {
        id: 4,
        reportType: "Report Post",
        description: "Bài viết chứa thông tin giả mạo",
        userId: 15,
        targetId: 8,
        createAt: new Date(),
        status: "False"
    },
    {
        id: 5,
        reportType: "Report Company",
        description: "Công ty không trả lương đúng hạn",
        userId: 16,
        targetId: 7,
        createAt: new Date(),
        status: "False"
    },
    {
        id: 6,
        reportType: "Report User",
        description: "Người này có hành vi quấy rối",
        userId: 14,
        targetId: 25,
        createAt: new Date(),
        status: "False"
    },
    {
        id: 7,
        reportType: "Report Post",
        description: "Bài đăng sai mô tả công việc",
        userId: 17,
        targetId: 11,
        createAt: new Date(),
        status: "False"
    },
    {
        id: 8,
        reportType: "Report Company",
        description: "Công ty yêu cầu ứng viên đóng phí",
        userId: 18,
        targetId: 6,
        createAt: new Date(),
        status: "False"
    },
    {
        id: 9,
        reportType: "Report User",
        description: "Người dùng sử dụng lời lẽ không phù hợp",
        userId: 19,
        targetId: 30,
        createAt: new Date(),
        status: "False"
    },
    {
        id: 10,
        reportType: "Report Post",
        description: "Thông tin không đúng sự thật",
        userId: 13,
        targetId: 9,
        createAt: new Date(),
        status: "False"
    },
    {
        id: 11,
        reportType: "Report Company",
        description: "Công ty không liên hệ lại sau phỏng vấn",
        userId: 20,
        targetId: 4,
        createAt: new Date(),
        status: "False"
    },
    {
        id: 12,
        reportType: "Report User",
        description: "Người dùng đăng bài sai chuyên mục",
        userId: 22,
        targetId: 27,
        createAt: new Date(),
        status: "False"
    },
    {
        id: 13,
        reportType: "Report Post",
        description: "Nội dung không liên quan đến việc làm",
        userId: 23,
        targetId: 14,
        createAt: new Date(),
        status: "False"
    },
    {
        id: 14,
        reportType: "Report Company",
        description: "Bị từ chối phỏng vấn không rõ lý do",
        userId: 24,
        targetId: 2,
        createAt: new Date(),
        status: "False"
    },
    {
        id: 15,
        reportType: "Report User",
        description: "Người này lạm dụng chức năng hệ thống",
        userId: 25,
        targetId: 35,
        createAt: new Date(),
        status: "False"
    }
];