export default function TeamTable() {
  const groupA = [
    "CM INTER MIAMI",
    "THUNDER FC",
    "TITANS FC",
    "FALCON FC",
    "TG FC",
    "FC DALLAS",
  ];
  const groupB = [
    "LIONS FC",
    "ATLÉTICO RF",
    "VILARREAL",
    "GOLDEN WARRIOS",
    "CA NOTTS",
    "OS LISOS TEAM",
  ];

  return (
    <section className="py-8 px-4 bg-[#fdfaf3] min-h-[300px]">
      <h3 className="text-2xl font-bold text-center text-[#2d1f0f] mb-8">
        Times Pré-Inscritos
      </h3>

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Grupo A */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <h4 className="text-xl font-semibold text-[#557489] mb-4 text-center">
            Grupo A
          </h4>
          <ul className="divide-y divide-[#d0bb94]">
            {groupA.map((team, i) => (
              <li
                key={i}
                className="py-3 text-center text-[#2d1f0f] font-medium"
              >
                {team}
              </li>
            ))}
          </ul>
        </div>

        {/* Grupo B */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <h4 className="text-xl font-semibold text-[#557489] mb-4 text-center">
            Grupo B
          </h4>
          <ul className="divide-y divide-[#d0bb94]">
            {groupB.map((team, i) => (
              <li
                key={i}
                className="py-3 text-center text-[#2d1f0f] font-medium"
              >
                {team}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
