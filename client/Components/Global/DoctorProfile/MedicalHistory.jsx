import { useState } from 'react';

export default function MedicalHistoryTable() {
  const medicalHistory = [
    {
      id: 1,
      date: '15/10/2024',
      diagnosis: 'Viêm họng cấp',
      doctor: 'BS. Nguyễn A',
      details: {
        symptoms: 'Đau họng, sốt nhẹ',
        prescription: [
          { drug: 'Paracetamol', dosage: '500mg', instruction: '2 viên/ngày' },
          { drug: 'Amoxicillin', dosage: '250mg', instruction: '3 viên/ngày' },
        ],
        labResults: 'CRP tăng nhẹ',
        notes: 'Tái khám sau 5 ngày',
      },
    },
    {
      id: 2,
      date: '20/08/2024',
      diagnosis: 'Tiểu đường type 2',
      doctor: 'BS. Trần B',
      details: {
        symptoms: 'Mệt mỏi, khát nước',
        prescription: [{ drug: 'Metformin', dosage: '500mg', instruction: '1 viên/ngày' }],
        labResults: 'Glucose: 7.8 mmol/L',
        notes: 'Kiểm tra HbA1c sau 3 tháng',
      },
    },
  ];

  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="container-fluid">
      <h1>Lịch sử khám bệnh</h1>
      <table className="medical-table">
        <thead>
          <tr className="medical-table-header">
            <th>Ngày khám</th>
            <th>Chẩn đoán</th>
            <th>Bác sĩ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {medicalHistory.map((record) => (
            <>
              <tr
                key={record.id}
                className="medical-table-row"
                onClick={() => toggleRow(record.id)}
              >
                <td>{record.date}</td>
                <td>{record.diagnosis}</td>
                <td>{record.doctor}</td>
                <td className="toggle-icon">
                  {expandedRow === record.id ? '▼' : '▶'}
                </td>
              </tr>
              {expandedRow === record.id && (
                <tr>
                  <td colSpan="4" className="expanded-section">
                    <div className="expanded-content">
                      <h3 className="expanded-title">Chi tiết khám</h3>
                      <p><strong>Triệu chứng:</strong> {record.details.symptoms}</p>
                      <p><strong>Đơn thuốc:</strong></p>
                      <ul className="prescription-list">
                        {record.details.prescription.map((drug, index) => (
                          <li key={index}>
                            {drug.drug} - {drug.dosage} ({drug.instruction})
                          </li>
                        ))}
                      </ul>
                      <p><strong>Kết quả xét nghiệm:</strong> {record.details.labResults}</p>
                      <p><strong>Ghi chú:</strong> {record.details.notes}</p>
                      <button className="edit-button">Chỉnh sửa</button>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}