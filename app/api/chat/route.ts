import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { ResumeQuestion } from "@/lib/questions";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const {
      message,
      currentHtml,
      fontPairs,
      question,
      template,
      isMecTemplate,
    } = await request.json();

    // Define system instructions based on the selected template
    let systemInstructions = `You are an expert AI resume builder that helps users create professional resumes. 
    Your task is to update the provided HTML of a resume based on the user's input.
    Always maintain the current structure and styling of the HTML.
    Focus on adding or modifying content rather than changing the layout.`;

    // Add question type context to the system instructions
    if (question?.type) {
      systemInstructions += `\nThe user is currently providing information for the "${question.type}" section of their resume.`;
    }

    // Add MEC template specific instructions if applicable, but keep these instructions only for the AI
    if (isMecTemplate) {
      systemInstructions += `
     RESUME GUIDELINES
1. GENERAL GUIDELINES
●
All the content must be in Calibri font and size 9 unless stated otherwise.
●
Remove any headings or subheadings if not used.
●
Do not alter the template. Insert the required content within the placeholders (< >).
●
After each punctuation mark, make sure to leave a single space. [semicolon (;), colon (:), full stop (.) and
comma (,)]
●
Ensure that every sentence ends with a full stop.
●
Strictly follow the sentence structures outlined under each section as deviations will not be
encouraged.
●
Ensure your resume abides by the guidelines and contains appropriate content in each section.
●
Enter all the content as instructed in the guidelines.
●
Use the header on the second page only if the content goes beyond the first page.
●
Refer to the provided sample resume for clarification.
2. HEADER
●
●
●
●
The header is the topmost portion of the page that contains the Name, Contact Information and links
to relevant profiles (LinkedIn, GitHub, Portfolios).
In the case of two-page resumes, the header of the second page must only contain the name of the
student.
Press Enter only if a heading is present at the end of the first page of a two page resume.
Candidate Details and Profiles:
○
Name
■ Enter your full name in Calibri font and of size 16 in upper case and bold. Ensure that
the name entered matches the official records.
■ The name is to be aligned to the left side.
Eg: VAISHNAV BABURAJ MENON
○
LinkedIn
■ This section is mandatory.
■ This section is aligned to the left side.
■ Hyperlink the ‘LinkedIn’ text with your LinkedIn profile.
■ To hyperlink the text, select the text, hold CTRL + K, add the link and press Apply.
■ To remove the underline - select the text and press CTRL + U.
Eg: LinkedIn
○
GitHub
■ This section is optional.
■ This section is aligned to the left side.
■ Hyperlink the ‘GitHub’ text with your GitHub profile.
■ To hyperlink the text, select the text, hold CTRL + K, add the link and press Apply.
■ To remove the underline - select the text and press CTRL + U.
■ Remove the ‘GitHub’ text if not applicable.
Eg: GitHub
○
Portfolio
■ This section is optional.
■ This section is aligned to the left side.
■ The portfolio includes websites designed to showcase UI/UX design portfolios and
personal resumes created by the candidates themselves.
■ Hyperlink the ‘Portfolio’ text with your Portfolio.
■ To hyperlink the text, select the text, hold CTRL + K, add the link and press Apply.
■ To remove the underline - select the text and press CTRL + U.
■ Remove the ‘Portfolio’ text if not applicable.
Eg: Portfolio
○
Date of Birth
9.
■ Enter your date of birth in the format < DOB - DD/MM/YYYY > in Calibri font and of size
■ This section is aligned to the left side.
Eg: DOB - 19/09/2004
●
Contact Information:
○
Email ID
■ The .mec Email ID is to be added in Calibri font and of size 9.
■ This section is aligned to the right side.
○
■ The Email ID gets hyperlinked automatically.
■ The colour of the Email ID has to be changed to black.
■ To remove the underline - select the text and press CTRL + U.
Eg: vaishnavbaburajmenon.mec@gmail.com
Phone Number
■ Add your phone number in Calibri font and of size 9.
■ This section is aligned to the right side.
Eg: +91 XXXXXXXXXX
3. SKILLS AND INTERESTS
●
●
●
●
The content must be in Calibri font and of size 9.
All the skills should be in Title Case.
The students should have the ability to explain all the Skills and Interests mentioned in this section.
Technical Skills:
○
This section includes the specific technical skills required to work in a professional environment.
■ Some examples include:
CSE: Python, Java, C++
, JavaScript, SQL, HTML, CSS, React, Node.js, MySQL,
MongoDB, Flutter, Machine Learning, Angular
CSBS: Data Analytics, R, Excel, MATLAB, Oracle ERP, Salesforce, SAP
BusinessObject
ECE: MATLAB, LTspice, Arduino, Raspberry Pi, Verilog, VHDL, Xilinx, Cadence,
Wireless Communication, Vivado, RF Design, KiCad, ANSYS, Embedded
Systems, C++
, Embedded C, Proteus
EEE: MATLAB, Multisim, LTspice, Load Flow Analysis, PowerWorld Simulator,
PID Tuning, MATLAB Simulink, Solar Panel Design, Wind Turbines, Motor
Design, Transformer Testing, Siemens PLC, Allen-Bradley PLC, Battery
Management Systems (BMS), DC-DC Converters, Inverters, Circuit Protection
Systems
EBE: Sensor Design, Biomechanics, Rehabilitation Engineering, AI in
Healthcare Diagnostics, Clinical Engineering, Prosthetics, Instrumentation
ME: AutoCAD, SolidWorks, ANSYS, CNC Programming, PLC Programming,
CFD Analysis, MATLAB Simulink, MSC Adams
■ If the skills take up more than one line, press Enter and make sure the next line starts
directly under the first line.
○
Eg: Technical Skills: Python, Java, C++, JavaScript, SQL
●
Soft Skills:
○
●
This section includes the non-technical skills that aid the success of employees in a workplace.
■ Some examples of Soft Skills include:
Soft Skills: Communication, Problem Solving, Teamwork, Leadership,
Adaptability, Critical Thinking, Attention to Detail, Organizational Skills, Time
Management, Team Collaboration, Creativity, Conflict Resolution, Interpersonal
Skills
○
If the skills listed take up more than one line, press Enter and make sure the next line starts
directly under the first line.
○
Eg: Soft Skills: Communication, Problem Solving, Teamwork
Interests:
○
This section includes the technical interests of the students.
■ Some examples include:
CSE: Web Development, Machine Learning, Artificial Intelligence, Cybersecurity,
Data Analysis, Blockchain Technology, DevOps, Game Development
CSBS: Artificial Intelligence and Business Applications, Data Analytics and
Visualisation, Cloud Computing, Blockchain, Financial Technology, Machine
Learning, CRM and ERP Systems, Cybersecurity, Business Process Automation
ECE: VLSI Design and Simulation, PCB Design and Circuit Simulation,
Embedded Systems and IoT, Signal and Image Processing, FPGA Programming
(Verilog/VHDL), Optical Fibre Communication, Power Electronics and Systems,
Telecommunication Networks, Mechatronics
EEE: Power Systems and Renewable Energy, Embedded Systems Design,
Electric Vehicle Technology, Robotics and Automation, Microcontroller
Programming, Energy Storage Systems, IoT for Smart Grids, VLSI Design,
Power Electronics, Wireless Communication Systems
EBE: Biomedical Instrumentation, Medical Imaging (CT, MRI, Ultrasound),
Wearable Health Devices, Biomedical Signal Processing, Artificial Organs,
Biosensors, Rehabilitation Engineering, Biomechanics, AI in Healthcare
Diagnostics, Robotics in Surgery
ME: CAD, 3D Printing, Thermal and Fluid Dynamics, CNC Programming,
Robotics and Automation, Renewable Energy Systems, Vehicle Dynamics,
Material Science, Industrial Automation, Structural Analysis
■ If the interests listed take up more than one line, press Enter and make sure the next line
starts directly under the first line.
Eg: Interests: VLSI Design and Simulation, PCB Design and Circuit Simulation, Machine Learning
○
4. EDUCATION
●
The content must be in Calibri font and of size 9.
●
Course, College/School name and University/Board must be left aligned.
●
The year of passing out and score must be right aligned.
●
The educational qualifications must be entered in the order of recency with bulleted points.
●
Courses:
○
Institution:
■ Enter the complete name of the institution.
■ The institution name must be bold.
■ Eg:
Govt. Model Engineering College
Rajagiri Public School
○
Board:
■ Enter the short forms of the board that is affiliated with the institution.
■ The name of the board must be in bold.
■ The name of the board should be mentioned below the institution name.
For B.Tech:
■ Eg: KTU
For Diploma:
■ Eg: SBTE
For School:
■ Eg: CBSE/ICSE/State
○
B.Tech:
■ The text must be in Calibri font and of size 9.
■ Enter your branch name after the university name separated by “
,
” within the
placeholder.
■ Remove the placeholder after the branch has been entered.
■ The branches include:
Computer Science Engineering
Computer Science and Business Systems
Electrical and Electronics Engineering
Electronics and Communication Engineering
Electronics and Biomedical Engineering
Mechanical Engineering
■ Eg: KTU, B.Tech in Computer Science Engineering
○
Diploma:
■ The text must be in Calibri font and of size 9.
■ This section is applicable only for lateral entry students.
■ Enter your branch after the Board.
■ The board and the branch are separated using a comma.
Eg: SBTE, Automobile Engineering
●
○
Class 12th:
■ The text must be in Calibri font and of size 9.
■ Enter the Class after the Board.
■ Eg: CBSE, 12th
○
Class 10th:
■ The text must be in Calibri font and of size 9.
■ Enter the Class after the Board.
■ Eg: CBSE, 10th
Aggregates:
○
B.Tech:
■ Aggregate for B.Tech is the CGPA earned till the recent semester for which the results
have been published.
■ The aggregate mentioned must be right aligned.
■ Include the CGPA rounded up to one decimal place if there is a decimal part.
■ Display the CGPA without a decimal point if it is a whole number.
■ The CPGA must be in italics.
■ Eg: 9.2, 8.5, 8
■ To view your CGPA:
Login to your KTU website.
Click on the Student Tab.
Click on View Full Profile.
Click on the Curriculum Tab.
■ To manually calculate your CGPA use an online CGPA calculator or follow the steps
given below.
Gather the grades for all subjects.
Convert each grade to its corresponding grade point.
Multiply the grade points by the credit hours of the respective subjects and then
add the results.
Divide the result by the total number of credit hours.
■ The grade points corresponding to each grade are listed below.
Grade Grade Point
S 10
A+ 9
A+ 8.5
B+ 8
B 7.5
C+ 7
C 6.5
D 6
P 5.5
F 0
FE 0
I 0
○
○
■ To view your SGPA:
Login to your KTU portal.
Click on the Result Tab.
Click on the Semester Select option.
Select your respective semester and view the SGPA below.
■ Calculation of SGPA:
Subject 1: Credit = 4 Grade = S Grade Point = 10
Subject 2: Credit = 4 Grade = A+
Grade Point = 9
Subject 3: Credit = 3 Grade = S Grade Point = 10
Subject 4: Credit = 3 Grade = B+
Grade Point = 8
Subject 5: Credit = 2 Grade = A+
Grade Point = 9
Total Credits = 16
SGPA = ((10*4) + (9*4) + (10*4) + (8*3) + (9*3) + (9*3)) / 16 = 9.25
■ Calculation of CGPA:
SGPA for Semester 1: 9.1 SGPA for Semester 2: 9.5 SGPA for Semester 3: 9.0 SGPA for Semester 4: 8.9 Credits: 17
Credits: 21
Credits: 22
Credits: 22
Total Credits = 82
CGPA = ((9.1*17) + (9.5*21) + (9.0*22) + (8.9*22)) / 82 = 9.1
Diploma:
■ This section is only for Lateral Entry students.
■ Include the CGPA rounded up to one decimal place if there is a decimal part.
■ Display the CGPA without a decimal point if it is a whole number.
■ The CPGA must be in italics.
■ Eg: 9.4, 8.5, 7.3, 7
Class 12th:
■ Mention the percentage earned by referring to the official 12th certificates.
■ Aggregate must be mentioned in percentage (%) and rounded up to one decimal place if
there is a decimal part.
■ The percentage must be in italics.
■ Eg: 94.2%, 88.8%, 70%
■ Calculation:
For ICSE Board:
■ The percentage marks can be calculated as follows.
■ Percentage Marks = Total Marks scored / 5
■ Total Marks Scored = Marks in English + Marks in the Best 4 Subjects.
○
■ Eg: For Total marks = 440
Aggregate = 440 / 5 = 88%
For CBSE Board:
■ The percentage marks can be calculated as follows.
■ Percentage Marks = Total marks scored / 5
■ Eg: For Total marks = 450
Aggregate = 450 / 5 = 90%
For State Board:
■ The percentage marks can be calculated as follows.
■ Percentage Marks = Total Marks scored / 12
■ Eg: For Total Marks = 1120
Aggregate = 1120 / 12 = 93.3%
Class 10th:
■ Mention the percentage of the students referring to the official 10th certificates.
■ Aggregate must be included in percentage (%) and rounded up to one decimal place if
there is a decimal part.
■ The percentage must be in italics.
■ Eg: 92.5%, 83.2%, 75%
■ Calculation:
For ICSE Board:
■ The percentage marks can be calculated as follows.
■ Percentage Marks = Total Marks scored / 5
■ Eg: For Total marks = 470
Aggregate = 470 / 5 = 94%
For CBSE Board:
■ The percentage marks can be calculated as follows.
■ Percentage Marks = Total marks scored / 5
■ Eg: For Total marks = 420
Aggregate = 430 / 5 = 86%
For State Board:
■ The percentage marks can be calculated as follows.
■ Percentage Marks = (Total grade points scored * 10) / 9
■ Eg: For Total Grade Points scored = 80
Aggregate = (80 * 10) / 9 = 88.8%
■ For calculating grade points:
Grade Grade Points
A+ 9
A 8
B+ 7
B 6
C+ 5
C 4
D+ 3
D 2
E 1
●
Year:
○
○
○
○
The year of graduation is to be mentioned above the CGPA / Percentage.
The year mentioned must be right aligned.
The year is to be indicated in numbers.
Eg: 2026
●
Eg:
○
Govt. Model Engineering College 2026
KTU, B.Tech in Computer Science Engineering 9.4
5. WORK EXPERIENCE
●
●
●
The text must be in Calibri font and of size 9.
The layout must be kept the same and should not be altered.
The section covers all the internships, part-time jobs and apprenticeships done by the students,
either ongoing or completed.
●
Paid internships should only be mentioned if they were completed in an offline setting or if a
project or significant work was successfully accomplished. Make sure to upload a certificate or proof
of completion.
●
The link to the certificates or proof of internships from the shared folder must be hyperlinked to the
company name.
●
●
The students should make sure to provide global access to the hyperlinked certificates.
To hyperlink the text, select the text, hold CTRL + K, paste the link to the certificate or proof and press
Apply.
●
●
●
●
The colour of the hyperlinked text has to be changed to black.
To remove the underline - select the text and press CTRL + U.
Paid online internships without any projects should be listed under Courses and Certifications.
The prioritisation in this section can be based on the importance and technical relevance of the company.
Students can make adjustments according to the position they prefer within the company.
●
If a student has more than two work experiences, they should copy the format of the second work
experience template and fill in the required details for each additional experience.
●
●
●
Company, Description and Technologies Used had to be left aligned.
Duration has to be right aligned.
The details of the following sections had to be correctly mentioned.
○
Company:
■ The full name of the organisation has to be provided.
■ The company name should be bold.
■ First letter of each word must be in Title Case.
■ Eg: Adobe, IBM, NVIDIA, BHEL, KSEB, IBM, Citius Tech
○
Role:
■ The roles students have held or are currently working in can be mentioned here.
■ The text must be bold and in Title Case.
■ Eg: Software Developer, Data Analyst Intern, Frontend Developer, Test Engineer, Circuit Design Intern,
Marketing Intern, CAD Design Trainee, Bioinstrumentation Intern, Quality Assurance Intern, Industrial
Training Intern, Intern
○
Technologies Used:
■ The technologies that have been used or have been mastered during the work should be
specified in this section, followed by a colon.
■ The text should be in italics and in Title Case.
■ Eg: C, MySQL, Python, Pandas, Numpy, ESP 32, 8051, Arduino, STM 32, PIR Sensors, TCS3200, VL53L0X,
AutoCAD, Verilog, Vivado, DHT11, MEMS, 3D Printing, TMS320C2000 Series, Nuvoton N76E003, Pulse
Oximeters, Blood Glucose Monitors, Spirometers, Patient Monitors, ANSYS, MATLAB
○
○
Duration:
■ The text should be in italics and in Title Case.
■ The duration must be aligned to the right side.
■ It should be mentioned in days, weeks or months.
If the duration is less than 7 days, then mention the duration in days.
If the duration is less than 30 days, then mention the duration in weeks.
If the duration is more than 30 days, then mention the duration in months.
If the project is currently in progress, mention the duration as Ongoing.
■ Eg: 3 Weeks, 1 Month, Ongoing
Description:
■ The content should be in proper sentences to provide the details of the experience at the
company.
■ The description must be unbolded.
■ The post and project should be in Title Case.
■ The description must not exceed two lines.
■ Format:
For Completed Work Experience:
■ Worked as a/an <Post>, <work done>.
■ Gained practical experience in <work done>.
■ Hands-on involvement in the development of <Project>.
■ Direct involvement in the development of <Project> for/in/aimed at <description>.
■ Acquired hands-on expertise with <work done>.
■ Developed strong proficiency in <work done>.
Eg:
■ Worked as a Data Analyst Intern, analysing large datasets to derive actionable insights,
leading to a 15% improvement in decision-making efficiency.
●
Eg:
○
■ Gained practical experience in Engine Diagnostics and Transmission Repair.
■ Hands-on involvement in the development of the Automated Conveyor System and
contributed to the design, assembly and optimisation of mechanical components.
■ Direct involvement in the development of a Chatbot aimed at sustainable development.
■ Acquired hands-on expertise with multiple medical devices including ECG Machines and
Infusion Pumps, gaining insights into their functions and medical applications.
■ Developed strong proficiency in designing and testing embedded systems to enhance
real-time data processing efficiency.
For Ongoing Work Experience:
■ Currently working as a/an <Post>, <work done>.
■ Actively involved in the development of a/an <Project> as a/an <Post>.
■ Involved in <work done>, gaining valuable experience in <description>.
Eg:
■ Currently working as an Intern, assisting in the design and testing of medical diagnostic
devices.
■ Actively involved in the development of an electric go-kart as a Mechanical Engineering
Intern.
■ Involved in PCB layout and Circuit Design, gaining valuable experience in power
electronics and signal processing.
Adobe 2
Months
Data Analyst Intern
Technologies Used: Python, MySQL, Pandas, NumPy, Matplotlib
Worked as a Data Analyst intern, analyzing large datasets to derive actionable insights, leading to a 15% improvement
in decision-making efficiency.
6. PROJECTS
●
●
●
●
All the text under this section should be in Calibri font with size 9.
The layout must be kept the same and should not be altered.
The section covers all the projects that have been completed or are currently working on.
The projects mentioned here should be relevant enough to showcase the experiences, skills and the
technical knowledge.
●
The students have to give more importance to the projects related to technical fields and these can be
customised according to the interests of various companies. It can include their mini projects or any other
projects done at various institutions.
●
●
The project names must be in bold and have to be followed by a colon.
If a student has more than two projects, they should copy the format of the second project
template and fill in the required details for each additional experience.
●
The Project Name, Role and Technologies Used are to be left aligned and the Duration of the project is
to be right aligned.
●
The details of the following sections had to be correctly mentioned.
○
Project Name:
■ The project name must be in bold characters and in Title Case.
■ The name of the project must be short.
■ Do not add a full stop at the end.
■ Eg: ResQbot, Smart Gloves, Hydroclear, Epicare, Hybrid Electric Charging Station, AI Customer
Service Chatbot
○
○
○
Role:
■ Add the role that outlines the work you contributed to the project.
■ The role should be concise and clearly convey its meaning.
■ The name of the role must be in bold.
■ The sentence must be in Title Case.
■ Eg: Frontend Developer, Full - Stack Developer, Hardware Developer, Designer, Project Lead,
Data Analyst, Prototyping and Fabrication Specialist
Technologies Used:
■ All the technologies used in the project are to be mentioned here, followed by a colon.
■ The text must be in italics and Title Case.
■ Ensure that the text is not bold.
■ Do not add a full stop at the end.
■ Eg: React, Node.js, Arduino, IOT, Embedded Systems, ESP 32, 8051, Arduino, STM 32, PIR Sensors,
Computer Aided Design, 3D Printing, Analog-to-Digital Converter (ADC), Filters, Rasberry Pi, MATLAB,
Verilog, Perl, TMS320C2000 Series, Nuvoton N76E003, FPGA
Team Size:
■ The team size must be denoted by natural numbers.
■ This section is right aligned.
■ The text must be in bold and in italics.
■ If the project was executed individually, keep the same as 1.
■ Eg: 1, 4, 5
○
○
Duration:
■ The duration must be unbolded and in italics.
■ It must be in Title Case.
■ It should be mentioned in days, weeks or months.
If the duration is less than 7 days, then mention the duration in days.
If the duration is less than 30 days, then mention the duration in weeks.
If the duration is more than 30 days, then mention the duration in months.
If the project is currently in progress, mention the duration as Ongoing.
■ Eg: 3 Days, 2 Weeks, 1 Month, Ongoing
Description:
■ The text must be in Calibri font and of size 9.
■ The description should not exceed two lines.
■ The name of the Project must be in Title Case.
■ The description must follow the given format.
Format:
■ For Completed Projects:
○
Designed/Created and developed a/an <Project Name> to/that <major
functions>.
○
Contributed to the development of <Project Name>, a/an/that <major
functions>.
○
Played a key role in the creation of <Project Name>, a/an <description of the
project>.
○
A/An <Project Name> was built to <major functions>.
○
Co-created a/an <Project Name> to <major functions>.
○
Led the development of <Project Name>, which <major functions>.
○
Built and implemented a/an <Project Name> designed to <major functions>.
■ Eg:
○
Designed and developed a Smart Glove for Differently Abled that detects hand
movements using an accelerometer and leverages IoT to control household
devices.
○
Contributed to the development of Hydroclear, a device that aids in clearing
water hyacinths when deployed in a water body.
○
Played a key role in the creation of ResQbot, a telegram bot for sending urgent
alerts to seek assistance.
○
An Epicare Wristband was built to detect tonic-clonic seizures.
○
Co-created a Wind Turbine to generate clean energy from wind, reducing
dependence on fossil fuels for power generation.
○
Led the development of SmartScheduler, which automates task management
and optimises team workflows.
○
Built and implemented a Biomedical Signal Acquisition System designed to
collect and analyse EEG data for neurological studies.
■ For Ongoing Projects:
○
Currently creating/developing a/an <Project Name> to/that <major
functions>.
○
Working on the development of <Project Name>, that <major functions>.
○
Actively working on the development of <Project Name>, designed to <major
functions>.
■ Eg:
○
○
○
Currently developing a Chatbot that uses AI to provide customer service in an
automated manner on websites.
Working on the development of a Fire Extinguisher Drone, that uses cameras
and temperature sensors to detect the source of fire.
Actively working on the development of a real-time health monitoring system,
designed to track vital signs and alert emergencies.
●
Eg:
○
Hydroclear Team Size: 3
Hardware Developer 3 Days
Technologies Used: Microcontrollers, motors, IR sensors, AutoCAD
Contributed to the development of Hydroclear, a device that aids in clearing water hyacinths when deployed in a
water body.
7. COURSES AND CERTIFICATIONS
●
All the text under this section should be in Calibri font and of size 9.
●
The course name, organisation name or the platform that provides the course should be in Title Case
and bolded.
●
The courses are to be ordered according to technical relevance and job position.
●
Workshops attended should not be mentioned in this section. The same has to be included in the
Achievements and Activities section.
●
Students should include only completed courses, excluding Honours and Minor.
●
●
●
●
●
●
●
●
●
●
Paid online internships where no projects were completed could be mentioned here.
The format should be uniform in the section.
The certificates from the shared drive must be hyperlinked to the Course Name.
The students should make sure to provide global access to the hyperlinked certificates.
To hyperlink the text, select Course Name, hold CTRL + K, paste the link to the certificate from the
shared drive and click Apply.
The colour of the hyperlinked text has to be changed to black.
To remove the underline - select the text and press CTRL + U.
If the certificate is not available, the course website should be hyperlinked with the Course Name.
If the certificate and the course website are not available, then this can be avoided.
The details should be provided in the following format.
○
Format:
■ Pursuing an/a Honours/Minor Degree in <Specialization/Branch> offered by KTU.
■ Obtained certification in <Course Name> certified by <Organisation/Company> in association with
<Organisation/Company>.
■ Successfully completed a course on <Topic> provided by <Organisation/Company> in affiliation with
<Organisation/Company>.
■ Acquired strong proficiency in <Topics> through <Tools/Technologies>.
■ Gained proficiency in <Topic >through a course provided by <Organisation/Company>.
■ Received certification for completing the <Course Name> program offered in collaboration with the
<Organisation/Company>.
■ Completed coursework in <Course Name> certified by <Organisation/Company>.
○
Eg:
■ Pursuing an Honours Degree in Machine Learning offered by KTU.
■ Pursuing a Minor Degree in Computing in Biomedical Engineering offered by KTU.
■ Pursuing a Minor Degree in Electronics and Communication offered by KTU.
■ Obtained certification in Data Structures and Algorithms certified by NPTEL in association with IIT Delhi.
■ Successfully completed a course on Machine Learning provided by Coursera in affiliation with
DeepLearning.AI.
■ Acquired strong proficiency in Data Structures and Algorithms through LeetCode and HackerRank.
■ Gained proficiency in AutoCAD through a course provided by Udemy.
■ Received certification for completing the Python for Everybody program offered in collaboration with the
University of Michigan.
■ Completed coursework in Digital Circuits certified by IIT Guwahati.
8. KEY POSITIONS
●
The content in this section must be in Calibri font and of size 9.
●
Mention the core positions you have held in college, clubs, cells or organisations in this section.
●
Exclude the volunteering duties associated with the club activities and it can be included under the
Achievements and Activities section.
●
A student representing a company or event as a Campus Ambassador at another institution can mention
the same in this section.
●
The listing should be prioritised based on the significance of the position within the Club/Organisation.
●
Make sure that positions in technical clubs are given more priority.
●
The list of clubs are given below:
Clubs Descriptions
Bharatham The musical club.
Bhoomithrasena The nature club.
BMA The association of Electronics and Biomedical Engineering students.
DSC Developer Students Club.
EMF The association of Electrical and Electronics Engineering students.
EXCEL The annual Techno-Managerial fest.
Fortitude The mental health club.
FOSS MEC The Free and Open Source club.
GDC MEC The game development club.
IEDC MEC The entrepreneurship development club.
MACS The association of Computer Science Engineering students.
●
●
Mixed Signals The association of Electronics and Communication students.
NSDC MEC The data science club.
Senate The administrative body of MEC.
Thanal MEC The student charity association.
The Book Thieves The reading club.
Third Eye The photography club.
Thudi The cultural club.
TinkerHub MEC The community-driven tech club.
TLE The competitive programming club.
TopGear The association of Mechanical Engineering students.
ASME MEC Not required.
Debate Club Not required.
Hult Prize MEC Not required.
CogniCor AICTE IDEALab Not required.
IEEE MEC SB Not required.
IETE SF MEC Not required.
Illuminati Quiz Club Not required.
MUNSOC MEC Not required.
NSS MEC Not required.
Placement Cell Not required.
SAE Not required.
TEDxMEC Not required.
Training Cell Not required.
YUVA Not required.
Format:
○
Eg:
○
○
○
○
○
○
○
○
○
○
○
○
○
○
○
○
○
○
Held the position of <Post> at <Club Name> <Year>, a <Club Description>, where I led/organised <specific tasks or
initiatives>.
Directed and managed technical operations as the <Post> of <Club Name> <Year>.
Took on the role of <Post> at <Club Name> <Year>, a <Club Description>.
Managed the role of <Post> at <Club Name> <Year>, a <Club Description>, with a focus on <key areas or duties>.
Worked as the <Post> at <Club Name> <Year>, <Club Description>.
Was selected as the <Post> for <Club Name> <Year>, <Club Description> overseeing/leading <specific responsibilities
or initiatives>.
Training/Placement Cell Volunteer, Govt. Model Engineering College.
Appointed as the Campus Ambassador for <Event/Organisation/Club/Institution> <Year>.
Selected as the Campus Ambassador for <Event/Organisation/Club/Institution> <Year>.
Designated as the Campus Ambassador for <Event/Organisation/Club/Institution> <Year>.
Held the position of Chairperson at Biomedical Association 2025, the association of Electronics and Biomedical
Engineering students, where I organised technical workshops and student development programs.
Directed and managed technical operations as the Chairperson of IEEE MEC SB 2025.
Took on the role of Vice Chairperson at Electrical Minds Forum 2025, the association of Electrical and Electronics
Engineering students.
Managed the role of Chief Marketing Officer at IEDC MEC 2024, focusing on strategic marketing initiatives and team
management.
Worked as the Design Head at Mixed Signals 2023, the association of Electronics and Communication Engineering
students.
Was selected as the Chairman for NSS MEC 2025 overseeing the overall planning and coordination of community
service projects.
Training Cell Volunteer, Govt. Model Engineering College.
Appointed as the Campus Ambassador for Geeks for Geeks 2025.
Selected as the Campus Ambassador for TEDxYouth 2024.
○
Designated as the Campus Ambassador for the National Entrepreneurship Summit 2024.
9. ACHIEVEMENTS AND ACTIVITIES
●
The content in this section must be entered in Calibri font and of size 9.
●
All content must be left aligned and in bullet points.
●
Achievements in competitions, hackathons and similar events must be included in this section.
●
The position achieved and the official name of the event must be mentioned in Title Case and bolded.
●
The certificates from the shared drive must be hyperlinked to the Name of the Event.
●
The students should make sure to provide global access to the hyperlinked certificates.
●
To hyperlink the text, select Course Name, hold CTRL + K, paste the link to the certificate from the
shared drive and click Apply.
●
The colour of the hyperlinked text has to be changed to black.
●
To remove the underline - select the text and press CTRL + U.
●
Achievements and activities are arranged based on the significance of the achievement, the
prominence of the organisation and the level of competition.
○
This section must be listed according to the order given below.
■ International Level
■ National Level
■ State Level
■ Zonal/District Level
■ Within College
●
Volunteering for clubs, organisations and events must be mentioned as per the priority order of technical
and non-technical.
●
This section may include details of workshops attended at the college or any other institutions.
●
Hobbies and extracurriculars must be included towards the end of the activities section, with at the most
4 separate hobbies.
●
Note that technical events are to be prioritised over non-technical achievements.
●
Achievements and Activities must be included in the following order:
○
Technical Achievements at competitions, projects and events conducted by MEC or other
institutions.
○
Participation in Technical Events such as workshops and events conducted by MEC or other
institutions.
○
Non-Technical Achievements like quizzes, arts, sports, debates and managerial events, at
state, national or international levels based on the priority order.
○
School-Level Achievements in technical fields at state, national or international levels based on
the priority order.
○
Scholarships and Fellowships except the monetary grants provided by MEC.
●
Use bold for the following points.
○
Rank/Position
○
Event Name
○
Tech Fest Name
○
Club/Organisation Name
○
Year
○
Institution Name
○
Scholarship or Fellowship Name
●
Use ordinal numbers for mentioning the positions.
■ Eg: 1st, 2nd, 3rd
●
Hobbies
○
●
Hobbies may be listed as the final point in this section.
The hobbies are to be mentioned in Title Case.
○
Note that a full stop should not be used at the end.
Format:
○
○
○
○
○
○
○
○
○
○
○
○
○
○
○
○
○
○
Secured <rank/prize/position> in/for <Event Name> <Year>, <Event Description> conducted by
<Organisation/Institution>.
Achieved <rank/prize/position> in/for <Event Name>, <Event Description> conducted as part of <Tech Fest Name>
<Year>, <Fest Description> of <Institution>.
Awarded <rank/prize/position> in <Event Name> <Year>, <Event Description> organised by
<Organisation/Institution>.
Ranked <position> in <Competition Name> <Year>, <Event Description>.
<Finalists/Semi-Finalists/Quarter-Finalists> in <Event Name> <Year>, <Event Description> organised by
<Organisation/Institution>.
Volunteer of <Event Name> <Year>, <Event Description> conducted by <Organisation/Institution>.
Member of <Club/Organisation Name>, <Club Description>.
Mentor of <Event Name> <Year>, <Event Description> conducted by <Organisation/Institution>.
Attended <Event Name>, a <workshop/boot camp/webinar/talk session> on <Topic>, organised by
<Organisation/Institution>.
Took part in <Event Name>, a <workshop/boot camp/webinar/talk session> on <Topic> conducted as part of <Tech
Fest Name> <Year>, <Fest Description> of <Institution>.
Participated in <Event Name>, <Event Description>, organised by <Organisation/Institution>.
○
○
○
○
○
Developed strong skills in <topics> through a <workshop/boot camp/webinar/talk session>, gaining experience with
<tools/technologies>.
Secured the <Scholarship Name> Scholarship <Year>, <Description>.
Recipient of the <Year> <Fellowship Name> Fellowship, <Description>.
Represented the college in intercollegiate tournaments, securing <Position> in the <Event> <Year>.
Hobbies: <hobbies>
●
Eg:
○
○
○
○
○
○
○
○
○
○
○
○
○
○
○
○
Secured 2nd prize in Slash Key 2023, a hackathon conducted by IEEE Kerala Section.
Achieved 2nd position in Binary Baton, a coding competition conducted as part of Excel 2023, the annual
techno-managerial fest of Govt. Model Engineering College.
Awarded 1st prize in MAGIC 2.0 2023, an overnight hackathon organised by IEEE MEC SB.
Ranked 4th in Google Code Jam 2023, an advanced algorithmic problem-solving competition.
Finalist in Hult Prize 2024, a competition for the project CARBORICH, proposing afforestation and carbon credit
trading, organised by Govt. Model Engineering College.
Volunteer of INFLUX 4.0 2023, an online mock placement drive conducted by IEEE MEC SB.
Member of FOSS MEC, the free and open-source software cell of Govt. Model Engineering College.
Mentor of Eye for Design 2023, a graphic design workshop conducted by IEDC MEC.
Attended Technopreneur 2023, an entrepreneurial summit organised by IEDC MEC.
Took part in Sustainable Future, a talk session on Sustainable Development conducted as part of Tathva 2023, the
annual techno-management fest of NIT Calicut.
Participated in MAGIC 2.0, 2023, an overnight hackathon organised by IEEE MEC SB.
Developed strong skills in Biomechanics and Tissue Engineering through a workshop, gaining experience with
COMSOL Multiphysics and BioCAD.
Secured the GHC Scholarship 2023, awarded for outstanding achievement in technology.
Recipient of the 2024 Millennium Fellowship, awarded for leadership excellence and fostering social change.
Represented the college in intercollegiate tournaments, securing 1st place in the Kerala Intercollegiate Football
Championship 2024.
Hobbies: Music, Dance, Football, Stamp Collection
10. REFERENCES
●
All the content in this section must be in Calibri font and of size 9.
●
To remove the underline, select the text and press CTRL + U.
●
The first reference should be from the Principal, which is common for everyone, while the second
reference must be from the HOD of your respective department.
●
The name of the HOD and Principal must be in bold and Title Case.
●
The Email ID should be in bold.
●
Format:
○
●
Prof. Dr. Mini M G, Principal, Govt. Model Engineering College, Kochi, Email ID: principal@mec.ac.in
○
For both CSE and CSBS: Prof. Dr. Binu V P, HOD, Computer Science Engineering, Govt. Model Engineering College,
Kochi, Email ID: binuvp@mec.ac.in
○
For EBE: Prof. Dr. Minimol. B, HOD, Electronics and Biomedical Engineering, Govt. Model Engineering College, Kochi,
Email ID: hodbe@mec.ac.in
○
For ECE: Prof. Pradeep M, HOD, Electronics and Communication Engineering, Govt. Model Engineering College, Kochi,
Email ID: hodec@mec.ac.in
○
For EEE: Prof. Dr. Bindu C. J, HOD, Electrical and Electronics Engineering, Govt. Model Engineering College, Kochi,
Email ID: hodeee@mec.ac.in
○
For ME: Prof. Dr. Rajesh V. G, HOD, Mechanical Engineering, Govt. Model Engineering College, Kochi, Email ID:
hodme@mec.ac.in
Other References:
○
Students can provide additional references to support their skills and accomplishments.
○
The references can be anyone in a senior position at a company or organisation.
○
Students must verify the credibility of these references.
○
The name and Email ID must be in bold.
○
The name and post should be mentioned in Title Case.
○
Format:
■ <Name>, <Post> at <Organisation/Company>, Email ID: <Email ID>
○
Eg:
■ Merlin Mathew, HR Executive at TATA Consultancy Services, Email ID: merlin@tcs.com
11. ADDITIONAL REFERENCES
●
Students will be provided access to a drive folder as <Class>
<RollNo>
_
_
●
Eg: CSA
63
VAISHNAV BABURAJ MENON
_
_
●
The following documents are to be uploaded.
○
Passport size photograph
○
Certificates of Internships Completed
○
Certificates of Achievements and Courses
○
Word and PDF File of Resume
<FullName>.
●
●
○
Grade cards for each semester
○
Photo identification Card - Aadhar Card/PAN Card/Passport
The students should make sure to provide global access to the hyperlinked certificates.
Documents must be uploaded using the specified naming format.
○
<FullName> - <Document Name>
○
Eg:
■ VAISHNAV BABURAJ MENON - Photo
■ VAISHNAV BABURAJ MENON - Resume
■ VAISHNAV BABURAJ MENON - ClassXII Certificate
■ VAISHNAV BABURAJ MENON - ClassX Certificate
■ VAISHNAV BABURAJ MENON - Aadhaar
■ VAISHNAV BABURAJ MENON - Sem1 Grade Card
■ VAISHNAV BABURAJ MENON - Sem2 Grade Card
■ VAISHNAV BABURAJ MENON - Sem3 Grade Card
■ VAISHNAV BABURAJ MENON - Sem4 Grade Card
■ VAISHNAV BABURAJ MENON - Sem5 Grade Card`;
    }

    const messages = [
      { role: "system", content: systemInstructions },
      { role: "user", content: `Current resume HTML: ${currentHtml}` },
      {
        role: "user",
        content: `Current question: ${
          question?.text || "Tell me about yourself"
        }`,
      },
      {
        role: "user",
        content: `Update my resume with this information: ${message}`,
      },
    ];

    // Add context about the template being used
    if (isMecTemplate) {
      messages.push({
        role: "user",
        content: `I'm using the MEC template. Please ensure the information follows MEC resume standards. Please maintain the bold and italics formatting strictly.`,
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    });

    // Convert messages to the format expected by Google's API
    const googleMessages = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const result = await model.generateContent({
      contents: googleMessages,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    });

    const response = await result.response;
    const responseContent = response.text() || "";
    const htmlMatch = responseContent.match(/<div[^>]*>[\s\S]*<\/div>/i);
    const html = htmlMatch ? htmlMatch[0] : currentHtml;

    // Assume modern fonts by default
    const fonts = fontPairs?.modern || { heading: "Poppins", body: "Poppins" };

    return NextResponse.json({
      success: true,
      html,
      fonts,
      message: responseContent,
    });
  } catch (error: any) {
    console.error("Error in API:", error);
    // Ensure we return a proper error response that the client can handle
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred",
      },
      { status: 500 }
    );
  }
}
