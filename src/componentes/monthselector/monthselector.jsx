import React from "react";
import "./monthselector.css";

export default function MonthSelector({ selectedMonth, onChange }) {
  const monthInputValue = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, "0")}`;

  const handleChange = (e) => {
    const [y, m] = e.target.value.split("-");
    onChange(new Date(Number(y), Number(m) - 1, 1));
  };

  return (
    <div className="month-selector">
      <label>Selecione o mês: </label>
      <input type="month" value={monthInputValue} onChange={handleChange} />
    </div>
  );
}
