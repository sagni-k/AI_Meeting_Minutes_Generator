export default function MeetingResults({ data }) {
  if (!data) return null;

  const { summary, keyDecisions, actionItems, meetingId } = data;

  return (
    <div
      className="rounded-2xl bg-white/10 backdrop-blur-md
                 border border-white/20 shadow-xl
                 p-6 space-y-6 text-white"
    >
      {/* Summary */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Summary</h3>
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {summary}
        </p>
      </section>

      {/* Key Decisions */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Key Decisions</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          {keyDecisions.map((decision, idx) => (
            <li key={idx} className="break-words">
              {decision}
            </li>
          ))}
        </ul>
      </section>

      {/* Action Items */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Action Items</h3>
        <div className="space-y-3">
          {actionItems.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white/5 border border-white/20 p-4"
            >
              <p className="text-sm break-words">{item.description}</p>
              <p className="text-xs text-gray-300 mt-1">
                Owner: <span className="font-medium">{item.owner}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Meeting ID */}
      <section className="text-xs text-gray-400 pt-2 border-t border-white/10">
        Meeting ID: {meetingId}
      </section>
    </div>
  );
}
