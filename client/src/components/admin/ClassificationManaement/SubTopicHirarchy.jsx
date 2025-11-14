export default function SubtopicHirarchy() {
  return (
    <div className="w-full">
      <h2 className="text-[20px] leading-7 font-semibold text-dark-blue mb-3">Hierarchy</h2>
      <div className="border rounded-md px-5 py-4 bg-white">
        <nav className="flex items-center space-x-3 text-base font-medium text-blue-dark">
          <a href="#" className="hover:underline text-dark-blue">
            Subject
          </a>
          <span>→</span>
          <a href="#" className="hover:underline">
            Topic
          </a>
          <span>→</span>
          <a href="#" className="hover:underline">
            Subtopic
          </a>
        </nav>
      </div>
    </div>
  );
}
