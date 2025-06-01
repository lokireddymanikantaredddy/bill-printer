import { Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { Bill } from '@/store/store';

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  dateRange: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 10,
  },
  table: {
    width: 'auto',
    marginBottom: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  billHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  summary: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
});

interface DetailedReportProps {
  bills: Bill[];
  startDate: Date;
  endDate: Date;
}

const ReportContent = ({ bills, startDate, endDate }: DetailedReportProps) => {
  const filteredBills = bills.filter(bill => {
    const billDate = new Date(bill.date);
    return billDate >= startDate && billDate <= endDate;
  });

  const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.total, 0);
  const totalPaidAmount = filteredBills.reduce((sum, bill) => {
    if (bill.isCredit && bill.creditDetails) {
      return sum + (bill.creditDetails.paidAmount || 0);
    }
    return sum + bill.total;
  }, 0);
  const totalPendingAmount = totalAmount - totalPaidAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Sri Srinivasa Fertilizers</Text>
        <Text style={styles.dateRange}>
          Detailed Report: {formatDate(startDate)} - {formatDate(endDate)}
        </Text>

        <View style={styles.section}>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 1 }]}>Date</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Bill No</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Customer</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Phone</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Amount</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Status</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Balance</Text>
            </View>

            {filteredBills.map((bill) => (
              <View key={bill.id}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {formatDate(new Date(bill.date))}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>{bill.billNumber}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{bill.customerName}</Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>{bill.customerPhone}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>₹{bill.total.toFixed(2)}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {bill.isCredit ? bill.creditDetails?.status || 'PENDING' : 'PAID'}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    ₹{bill.isCredit ? 
                      (bill.total - (bill.creditDetails?.paidAmount || 0)).toFixed(2) : 
                      '0.00'}
                  </Text>
                </View>

                {bill.items.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                    <Text style={[styles.tableCell, { flex: 1.5, color: '#666' }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 2, color: '#666' }]}>
                      {item.displayQuantity} × {item.unit.value} @ ₹{item.price}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1.5 }]}></Text>
                    <Text style={[styles.tableCell, { flex: 1, color: '#666' }]}>
                      ₹{item.total.toFixed(2)}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.summary}>
          <Text>Summary:</Text>
          <Text>Total Bills: {filteredBills.length}</Text>
          <Text>Total Amount: ₹{totalAmount.toFixed(2)}</Text>
          <Text>Total Paid: ₹{totalPaidAmount.toFixed(2)}</Text>
          <Text>Total Pending: ₹{totalPendingAmount.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
};

const DetailedReport = (props: DetailedReportProps) => {
  const fileName = `detailed-report-${formatDate(props.startDate)}-to-${formatDate(props.endDate)}.pdf`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-semibold">Detailed Report</h2>
        <PDFDownloadLink
          document={<ReportContent {...props} />}
          fileName={fileName}
          className="btn btn-primary w-full sm:w-auto"
        >
          {({ loading }) => (loading ? 'Preparing PDF...' : 'Export to PDF')}
        </PDFDownloadLink>
      </div>
      <div className="w-full h-[calc(90vh-8rem)]">
        <PDFViewer style={{ width: '100%', height: '100%' }}>
          <ReportContent {...props} />
        </PDFViewer>
      </div>
    </div>
  );
};

export default DetailedReport; 