export interface Reports {
    id: number;
    reportType: "Report Company" | "Report User" | "Report Post";
    description: string;
    userId: number;
    reportedContentId: number;
    createAt: Date;
    status: "Done" | "Process" | "Cancel";
}

export const mockReport: Reports[] = [
  {
    id: 1,
    reportType: "Report Post",
    description: "Đây là bài tuyển dụng lừa đảo",
    userId: 10,
    reportedContentId: 5,
    createAt: new Date(),
    status: "Done"
  },
  {
    id: 2,
    reportType: "Report Company",
    description: "Công ty không minh bạch trong tuyển dụng",
    userId: 12,
    reportedContentId: 3,
    createAt: new Date(),
    status: "Process"
  },
  {
    id: 3,
    reportType: "Report User",
    description: "Người dùng spam tin nhắn",
    userId: 11,
    reportedContentId: 21,
    createAt: new Date(),
    status: "Cancel"
  },
  {
    id: 4,
    reportType: "Report Post",
    description: "Bài viết chứa thông tin giả mạo",
    userId: 15,
    reportedContentId: 8,
    createAt: new Date(),
    status: "Done"
  },
  {
    id: 5,
    reportType: "Report Company",
    description: "Công ty không trả lương đúng hạn",
    userId: 16,
    reportedContentId: 7,
    createAt: new Date(),
    status: "Cancel"
  },
  {
    id: 6,
    reportType: "Report User",
    description: "Người này có hành vi quấy rối",
    userId: 14,
    reportedContentId: 25,
    createAt: new Date(),
    status: "Done"
  },
  {
    id: 7,
    reportType: "Report Post",
    description: "Bài đăng sai mô tả công việc",
    userId: 17,
    reportedContentId: 11,
    createAt: new Date(),
    status: "Done"
  },
  {
    id: 8,
    reportType: "Report Company",
    description: "Công ty yêu cầu ứng viên đóng phí",
    userId: 18,
    reportedContentId: 6,
    createAt: new Date(),
    status: "Done"
  },
  {
    id: 9,
    reportType: "Report User",
    description: "Người dùng sử dụng lời lẽ không phù hợp",
    userId: 19,
    reportedContentId: 30,
    createAt: new Date(),
    status: "Process"
  },
  {
    id: 10,
    reportType: "Report Post",
    description: "Thông tin không đúng sự thật",
    userId: 13,
    reportedContentId: 9,
    createAt: new Date(),
    status: "Done"
  },
  {
    id: 11,
    reportType: "Report Company",
    description: "Công ty không liên hệ lại sau phỏng vấn",
    userId: 20,
    reportedContentId: 4,
    createAt: new Date(),
    status: "Cancel"
  },
  {
    id: 12,
    reportType: "Report User",
    description: "Người dùng đăng bài sai chuyên mục",
    userId: 22,
    reportedContentId: 27,
    createAt: new Date(),
    status: "Done"
  },
  {
    id: 13,
    reportType: "Report Post",
    description: "Nội dung không liên quan đến việc làm",
    userId: 23,
    reportedContentId: 14,
    createAt: new Date(),
    status: "Done"
  },
  {
    id: 14,
    reportType: "Report Company",
    description: "Bị từ chối phỏng vấn không rõ lý do",
    userId: 24,
    reportedContentId: 2,
    createAt: new Date(),
    status: "Process"
  },
  {
    id: 15,
    reportType: "Report User",
    description: "Người này lạm dụng chức năng hệ thống",
    userId: 25,
    reportedContentId: 35,
    createAt: new Date(),
    status: "Done"
  },
  {
    id: 16,
    reportType: "Report Post",
    description: "Bài viết có nội dung gây hiểu lầm",
    userId: 26,
    reportedContentId: 10,
    createAt: new Date(),
    status: "Process"
  },
  {
    id: 17,
    reportType: "Report Company",
    description: "Công ty đăng tin tuyển dụng nhiều lần",
    userId: 27,
    reportedContentId: 12,
    createAt: new Date(),
    status: "Cancel"
  },
  {
    id: 18,
    reportType: "Report User",
    description: "Người dùng giả mạo danh tính",
    userId: 28,
    reportedContentId: 33,
    createAt: new Date(),
    status: "Done"
  },
  {
    id: 19,
    reportType: "Report Post",
    description: "Thông tin tuyển dụng không rõ ràng",
    userId: 29,
    reportedContentId: 17,
    createAt: new Date(),
    status: "Process"
  },
  {
    id: 20,
    reportType: "Report Company",
    description: "Công ty yêu cầu làm việc ngoài giờ không công",
    userId: 30,
    reportedContentId: 19,
    createAt: new Date(),
    status: "Done"
  },
  {
    id: 21,
    reportType: "Report User",
    description: "Người này đăng nội dung phản cảm",
    userId: 31,
    reportedContentId: 31,
    createAt: new Date(),
    status: "Done"
  },
  {
    id: 22,
    reportType: "Report Post",
    description: "Không tìm thấy thông tin liên hệ trong bài viết",
    userId: 32,
    reportedContentId: 16,
    createAt: new Date(),
    status: "Process"
  },
  {
    id: 23,
    reportType: "Report Company",
    description: "Công ty từ chối nhận hồ sơ không lý do",
    userId: 33,
    reportedContentId: 13,
    createAt: new Date(),
    status: "Cancel"
  },
  {
    id: 24,
    reportType: "Report User",
    description: "Người dùng quảng cáo sai sự thật",
    userId: 34,
    reportedContentId: 28,
    createAt: new Date(),
    status: "Done"
  },
  {
    id: 25,
    reportType: "Report Post",
    description: "Bài viết chứa đường link độc hại",
    userId: 35,
    reportedContentId: 20,
    createAt: new Date(),
    status: "Done"
  },
  {
    id: 26,
    reportType: "Report Company",
    description: "Công ty hứa hẹn sai thực tế công việc",
    userId: 36,
    reportedContentId: 15,
    createAt: new Date(),
    status: "Process"
  },
  {
    id: 27,
    reportType: "Report Post",
    description: "Đây là bài post giả mạo",
    userId: 37,
    reportedContentId: 36,
    createAt: new Date(),
    status: "Cancel"
  },
  {
    id: 28,
    reportType: "Report Post",
    description: "Tiêu đề gây hiểu lầm",
    userId: 38,
    reportedContentId: 18,
    createAt: new Date(),
    status: "Process"
  },
  {
    id: 29,
    reportType: "Report Company",
    description: "Thông tin sai lệch với thực tế làm việc",
    userId: 39,
    reportedContentId: 24,
    createAt: new Date(),
    status: "Cancel"
  },
  {
    id: 30,
    reportType: "Report User",
    description: "Người dùng sử dụng nhiều tài khoản để spam",
    userId: 40,
    reportedContentId: 40,
    createAt: new Date(),
    status: "Done"
  }
];