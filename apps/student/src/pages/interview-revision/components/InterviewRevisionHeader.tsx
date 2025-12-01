const InterviewRevisionHeader = () => {
  return (
    <div className="news-header animate-fade-in">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-primary opacity-10"></div>

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-white-10 rounded-full animate-gentle-float"></div>
      <div
        className="absolute bottom-10 left-10 w-16 h-16 bg-accent-10 rounded-full animate-gentle-float"
        style={{ animationDelay: '2s' }}
      ></div>

      <div className="relative container-center">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-display text-white mb-4 animate-fade-in-up">
            Câu hỏi <span className="text-accent">phỏng vấn</span>
          </h1>
          <p className="text-body-large text-white-90 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            Tham khảo các câu hỏi phỏng vấn được đóng góp bởi cộng đồng. Chia sẻ kinh nghiệm, đánh giá câu trả lời và học hỏi từ cộng đồng.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewRevisionHeader;
