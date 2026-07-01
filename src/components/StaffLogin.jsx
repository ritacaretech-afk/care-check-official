export default function StaffLogin({ staffList, currentStaff, loginStaff, logoutStaff }) {
  if (currentStaff) {
    return (
      <div className="staffLogin activeStaff">
        <div>
          <span>勤務中職員</span>
          <strong>{currentStaff}</strong>
        </div>
        <button onClick={logoutStaff}>ログアウト</button>
      </div>
    );
  }

  return (
    <div className="staffLogin">
      <div>
        <span>勤務開始</span>
        <strong>職員を選択してください</strong>
      </div>
      <div className="staffButtons">
        {(staffList || []).map((name) => (
          <button key={name} onClick={() => loginStaff(name)}>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
