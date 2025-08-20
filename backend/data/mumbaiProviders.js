const mumbaiProviders = [
  // Major Hospitals
  {
    name: "Lilavati Hospital & Research Centre",
    type: "hospital",
    specialty: "Multi-Specialty",
    description: "One of Mumbai's premier private hospitals offering world-class healthcare services with state-of-the-art facilities.",
    address: {
      street: "A-791, Bandra Reclamation",
      area: "Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      coordinates: { latitude: 19.0596, longitude: 72.8295 }
    },
    contact: {
      phone: ["+91-22-26751000", "+91-22-26751001"],
      email: "info@lilavatihospital.com",
      website: "https://www.lilavatihospital.com"
    },
    services: [
      { name: "Cardiology", description: "Complete cardiac care", price: 2500 },
      { name: "Neurology", description: "Advanced neurological treatments", price: 3000 },
      { name: "Orthopedics", description: "Joint replacement and sports medicine", price: 2000 }
    ],
    operatingHours: {
      monday: { open: "08:00", close: "20:00", closed: false },
      tuesday: { open: "08:00", close: "20:00", closed: false },
      wednesday: { open: "08:00", close: "20:00", closed: false },
      thursday: { open: "08:00", close: "20:00", closed: false },
      friday: { open: "08:00", close: "20:00", closed: false },
      saturday: { open: "08:00", close: "18:00", closed: false },
      sunday: { open: "09:00", close: "17:00", closed: false }
    },
    emergencyServices: true,
    insuranceAccepted: ["ICICI Lombard", "Bajaj Allianz", "HDFC Ergo", "Star Health"],
    languages: ["English", "Hindi", "Marathi", "Gujarati"],
    facilities: ["ICU", "NICU", "Operation Theaters", "Laboratory", "Radiology", "Pharmacy"],
    ratings: { average: 4.8, count: 1250 },
    verified: true,
    featured: true
  },
  {
    name: "Breach Candy Hospital Trust",
    type: "hospital",
    specialty: "Multi-Specialty",
    description: "Historic hospital known for excellence in healthcare, located in the heart of South Mumbai.",
    address: {
      street: "60, Bhulabhai Desai Road",
      area: "Breach Candy",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400026",
      coordinates: { latitude: 18.9159, longitude: 72.8258 }
    },
    contact: {
      phone: ["+91-22-23672888", "+91-22-23672889"],
      email: "info@breachcandyhospital.org",
      website: "https://www.breachcandyhospital.org"
    },
    services: [
      { name: "Obstetrics & Gynecology", description: "Maternity and women's health", price: 1800 },
      { name: "Pediatrics", description: "Child healthcare services", price: 1500 },
      { name: "General Surgery", description: "Surgical procedures", price: 2200 }
    ],
    operatingHours: {
      monday: { open: "08:00", close: "19:00", closed: false },
      tuesday: { open: "08:00", close: "19:00", closed: false },
      wednesday: { open: "08:00", close: "19:00", closed: false },
      thursday: { open: "08:00", close: "19:00", closed: false },
      friday: { open: "08:00", close: "19:00", closed: false },
      saturday: { open: "08:00", close: "17:00", closed: false },
      sunday: { open: "09:00", close: "16:00", closed: false }
    },
    emergencyServices: true,
    insuranceAccepted: ["Max Bupa", "Religare", "CIGNA", "Apollo Munich"],
    languages: ["English", "Hindi", "Marathi"],
    facilities: ["ICU", "NICU", "Operation Theaters", "Laboratory", "Pharmacy"],
    ratings: { average: 4.7, count: 890 },
    verified: true,
    featured: true
  },
  {
    name: "Bombay Hospital & Medical Research Centre",
    type: "hospital",
    specialty: "Multi-Specialty",
    description: "Trusted healthcare institution providing comprehensive medical services to Mumbaikars.",
    address: {
      street: "12, New Marine Lines",
      area: "Marine Lines",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400020",
      coordinates: { latitude: 18.9290, longitude: 72.8347 }
    },
    contact: {
      phone: ["+91-22-22067676", "+91-22-22067677"],
      email: "info@bombayhospital.com",
      website: "https://www.bombayhospital.com"
    },
    services: [
      { name: "Oncology", description: "Cancer treatment and care", price: 3500 },
      { name: "Urology", description: "Urological procedures", price: 2800 },
      { name: "Dermatology", description: "Skin care and treatments", price: 1200 }
    ],
    operatingHours: {
      monday: { open: "07:00", close: "21:00", closed: false },
      tuesday: { open: "07:00", close: "21:00", closed: false },
      wednesday: { open: "07:00", close: "21:00", closed: false },
      thursday: { open: "07:00", close: "21:00", closed: false },
      friday: { open: "07:00", close: "21:00", closed: false },
      saturday: { open: "07:00", close: "19:00", closed: false },
      sunday: { open: "08:00", close: "18:00", closed: false }
    },
    emergencyServices: true,
    insuranceAccepted: ["Star Health", "Bajaj Allianz", "ICICI Lombard", "HDFC Ergo"],
    languages: ["English", "Hindi", "Marathi", "Gujarati"],
    facilities: ["ICU", "Operation Theaters", "Laboratory", "Radiology", "Pharmacy", "Blood Bank"],
    ratings: { average: 4.6, count: 1100 },
    verified: true,
    featured: false
  },
  // Specialized Clinics
  {
    name: "Dr. Ramesh Shah's Cardiology Clinic",
    type: "clinic",
    specialty: "Cardiology",
    description: "Specialized cardiac care clinic with experienced cardiologists and modern diagnostic equipment.",
    address: {
      street: "15, Linking Road",
      area: "Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      coordinates: { latitude: 19.0596, longitude: 72.8295 }
    },
    contact: {
      phone: ["+91-22-26455555"],
      email: "drshah@cardiologyclinic.com",
      website: "https://www.drshahcardiology.com"
    },
    services: [
      { name: "ECG", description: "Electrocardiogram", price: 800 },
      { name: "Echo", description: "Echocardiogram", price: 1500 },
      { name: "Stress Test", description: "Treadmill test", price: 1200 }
    ],
    operatingHours: {
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "18:00", closed: false },
      friday: { open: "09:00", close: "18:00", closed: false },
      saturday: { open: "09:00", close: "16:00", closed: false },
      sunday: { open: "10:00", close: "14:00", closed: false }
    },
    emergencyServices: false,
    insuranceAccepted: ["ICICI Lombard", "Bajaj Allianz"],
    languages: ["English", "Hindi", "Marathi"],
    facilities: ["ECG Machine", "Echo Machine", "Treadmill", "Consultation Room"],
    ratings: { average: 4.9, count: 450 },
    verified: true,
    featured: false
  },
  // Pharmacies
  {
    name: "Apollo Pharmacy - Andheri West",
    type: "pharmacy",
    specialty: "Retail Pharmacy",
    description: "24/7 pharmacy offering prescription medicines, health products, and consultation services.",
    address: {
      street: "Shop No. 5, Crystal Plaza",
      area: "Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400058",
      coordinates: { latitude: 19.1197, longitude: 72.8464 }
    },
    contact: {
      phone: ["+91-22-26734567"],
      email: "andheri@apollopharmacy.com",
      website: "https://www.apollopharmacy.com"
    },
    services: [
      { name: "Prescription Medicines", description: "All types of medicines", price: null },
      { name: "Health Products", description: "Vitamins and supplements", price: null },
      { name: "Health Checkup", description: "Basic health screening", price: 500 }
    ],
    operatingHours: {
      monday: { open: "00:00", close: "23:59", closed: false },
      tuesday: { open: "00:00", close: "23:59", closed: false },
      wednesday: { open: "00:00", close: "23:59", closed: false },
      thursday: { open: "00:00", close: "23:59", closed: false },
      friday: { open: "00:00", close: "23:59", closed: false },
      saturday: { open: "00:00", close: "23:59", closed: false },
      sunday: { open: "00:00", close: "23:59", closed: false }
    },
    emergencyServices: true,
    insuranceAccepted: ["Apollo Munich", "Star Health"],
    languages: ["English", "Hindi", "Marathi"],
    facilities: ["Prescription Counter", "Consultation Room", "Health Products Section"],
    ratings: { average: 4.5, count: 320 },
    verified: true,
    featured: false
  },
  // Dental Clinics
  {
    name: "Smile Dental Care - Colaba",
    type: "dental",
    specialty: "Dentistry",
    description: "Modern dental clinic offering comprehensive oral healthcare services with advanced technology.",
    address: {
      street: "23, Colaba Causeway",
      area: "Colaba",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      coordinates: { latitude: 18.9217, longitude: 72.8347 }
    },
    contact: {
      phone: ["+91-22-22875555"],
      email: "info@smiledentalcolaba.com",
      website: "https://www.smiledentalcolaba.com"
    },
    services: [
      { name: "Root Canal", description: "Endodontic treatment", price: 8000 },
      { name: "Dental Implants", description: "Permanent tooth replacement", price: 45000 },
      { name: "Teeth Whitening", description: "Professional whitening", price: 5000 }
    ],
    operatingHours: {
      monday: { open: "10:00", close: "19:00", closed: false },
      tuesday: { open: "10:00", close: "19:00", closed: false },
      wednesday: { open: "10:00", close: "19:00", closed: false },
      thursday: { open: "10:00", close: "19:00", closed: false },
      friday: { open: "10:00", close: "19:00", closed: false },
      saturday: { open: "10:00", close: "17:00", closed: false },
      sunday: { open: "11:00", close: "16:00", closed: false }
    },
    emergencyServices: false,
    insuranceAccepted: ["Star Health", "Bajaj Allianz"],
    languages: ["English", "Hindi", "Marathi"],
    facilities: ["Dental Chair", "X-Ray Machine", "Sterilization Unit", "Consultation Room"],
    ratings: { average: 4.7, count: 280 },
    verified: true,
    featured: false
  },
  // Eye Care Centers
  {
    name: "Eye Care Centre - Bandra",
    type: "eye-care",
    specialty: "Ophthalmology",
    description: "Specialized eye care center offering comprehensive vision care and surgical procedures.",
    address: {
      street: "45, Hill Road",
      area: "Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      coordinates: { latitude: 19.0596, longitude: 72.8295 }
    },
    contact: {
      phone: ["+91-22-26448888"],
      email: "info@eyecarebandra.com",
      website: "https://www.eyecarebandra.com"
    },
    services: [
      { name: "Eye Examination", description: "Comprehensive eye checkup", price: 1000 },
      { name: "LASIK Surgery", description: "Vision correction surgery", price: 35000 },
      { name: "Cataract Surgery", description: "Lens replacement surgery", price: 25000 }
    ],
    operatingHours: {
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "18:00", closed: false },
      friday: { open: "09:00", close: "18:00", closed: false },
      saturday: { open: "09:00", close: "16:00", closed: false },
      sunday: { open: "10:00", close: "14:00", closed: false }
    },
    emergencyServices: false,
    insuranceAccepted: ["ICICI Lombard", "Star Health", "Bajaj Allianz"],
    languages: ["English", "Hindi", "Marathi"],
    facilities: ["Eye Examination Room", "Surgical Theater", "Optical Shop", "Consultation Room"],
    ratings: { average: 4.8, count: 420 },
    verified: true,
    featured: false
  },
  // Mental Health Centers
  {
    name: "Mind Wellness Centre - Andheri",
    type: "mental-health",
    specialty: "Psychiatry & Psychology",
    description: "Professional mental health center providing counseling, therapy, and psychiatric care.",
    address: {
      street: "12, MG Road",
      area: "Andheri East",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400069",
      coordinates: { latitude: 19.1197, longitude: 72.8464 }
    },
    contact: {
      phone: ["+91-22-26884444"],
      email: "info@mindwellnessandheri.com",
      website: "https://www.mindwellnessandheri.com"
    },
    services: [
      { name: "Individual Therapy", description: "One-on-one counseling sessions", price: 2000 },
      { name: "Couple Therapy", description: "Relationship counseling", price: 2500 },
      { name: "Psychiatric Consultation", description: "Mental health evaluation", price: 3000 }
    ],
    operatingHours: {
      monday: { open: "10:00", close: "19:00", closed: false },
      tuesday: { open: "10:00", close: "19:00", closed: false },
      wednesday: { open: "10:00", close: "19:00", closed: false },
      thursday: { open: "10:00", close: "19:00", closed: false },
      friday: { open: "10:00", close: "19:00", closed: false },
      saturday: { open: "10:00", close: "17:00", closed: false },
      sunday: { open: "11:00", close: "15:00", closed: false }
    },
    emergencyServices: false,
    insuranceAccepted: ["Star Health", "ICICI Lombard"],
    languages: ["English", "Hindi", "Marathi"],
    facilities: ["Therapy Rooms", "Consultation Room", "Group Therapy Hall", "Reception"],
    ratings: { average: 4.6, count: 180 },
    verified: true,
    featured: false
  }
];

module.exports = mumbaiProviders;


