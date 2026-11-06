const getLeads = async () => {
  // Temporary sample data for API testing
  const leads = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@example.com",
      company: "ABC Technologies",
      status: "New",
      source: "Website",
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya@example.com",
      company: "XYZ Solutions",
      status: "Contacted",
      source: "Referral",
    },
  ];

  return leads;
};

module.exports = {
  getLeads,
};