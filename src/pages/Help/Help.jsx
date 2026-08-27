import { useMemo, useState } from "react";
import styled from "styled-components";
import { FiBookOpen, FiChevronDown, FiMail, FiSearch, FiUsers, FiClock, FiDollarSign, FiSettings } from "react-icons/fi";

const topics = [
  { icon: FiUsers, title: "People Hub", text: "Employees, staff, agents, teams and onboarding." },
  { icon: FiClock, title: "Time Hub", text: "Attendance, leave, shifts, overtime and holidays." },
  { icon: FiDollarSign, title: "Pay Hub", text: "Payroll, paysheets, additions and deductions." },
  { icon: FiSettings, title: "Settings", text: "Organization, departments, roles and permissions." },
];

const questions = [
  { question: "How do I create an employee, staff member or agent?", answer: "Open People Hub, select the relevant list, and choose the create or onboarding action. Complete Personal Information, Documents and Work or Commission Details before submitting." },
  { question: "How do I edit a person's details?", answer: "Open the person from their list, stay on Personal Details and select Edit details. Save the form to update their profile." },
  { question: "How do I manage profile documents?", answer: "Open Personal Details and use Upload to add documents. The controls beside an existing document let you preview, change or remove it." },
  { question: "Where can I manage attendance and leave?", answer: "Use Time Hub for attendance, timesheets, leave requests, shifts, overtime, leaderboards and holidays." },
  { question: "Why can’t I see a menu or action?", answer: "Access is controlled by role permissions. Ask an administrator to review Settings → Roles and enable the required view, add, edit or delete permission." },
  { question: "What should I do when saving fails?", answer: "Check required fields and your network connection, then try again. If the error continues, note the page and error message and contact your administrator." },
];

const Help = () => {
  const [query, setQuery] = useState("");
  const [openQuestion, setOpenQuestion] = useState(0);
  const filteredQuestions = useMemo(() => {
    const value = query.trim().toLowerCase();
    return value ? questions.filter((item) => `${item.question} ${item.answer}`.toLowerCase().includes(value)) : questions;
  }, [query]);

  return (
    <Page>
      <Hero>
        <IconCircle><FiBookOpen /></IconCircle>
        <div><Title>How can we help?</Title><Subtitle>Find answers and learn how to use the HRMS.</Subtitle></div>
        <Search><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search help topics" aria-label="Search help topics" /></Search>
      </Hero>

      <SectionTitle>Browse by topic</SectionTitle>
      <TopicGrid>{topics.map(({ icon: Icon, title, text }) => <Topic key={title}><TopicIcon><Icon /></TopicIcon><div><h3>{title}</h3><p>{text}</p></div></Topic>)}</TopicGrid>

      <ContentGrid>
        <FaqCard>
          <SectionTitle>Frequently asked questions</SectionTitle>
          <FaqList>{filteredQuestions.length ? filteredQuestions.map((item, index) => {
            const open = openQuestion === index;
            return <Faq key={item.question}><FaqButton type="button" onClick={() => setOpenQuestion(open ? -1 : index)} aria-expanded={open}><span>{item.question}</span><FiChevronDown /></FaqButton>{open && <Answer>{item.answer}</Answer>}</Faq>;
          }) : <Empty>No help articles match “{query}”.</Empty>}</FaqList>
        </FaqCard>
        <SupportCard><SupportIcon><FiMail /></SupportIcon><h2>Still need help?</h2><p>Contact your HRMS administrator and include the page, action and error message.</p><a href="mailto:support@subamhrms.com">Email support</a></SupportCard>
      </ContentGrid>
    </Page>
  );
};

export default Help;

const Page = styled.main`display:flex;flex-direction:column;gap:22px;padding:24px 0;color:#0c2427;box-sizing:border-box;`;
const Hero = styled.section`padding:28px;border-radius:12px;background:linear-gradient(135deg,#066c78,#0b8792);color:#fff;display:grid;grid-template-columns:auto 1fr minmax(260px,420px);align-items:center;gap:18px;@media(max-width:800px){grid-template-columns:auto 1fr;.search{grid-column:1/-1;}}`;
const IconCircle = styled.div`width:54px;height:54px;border-radius:12px;background:#ffffff20;display:grid;place-items:center;font-size:26px;`;
const Title = styled.h1`margin:0 0 5px;font:700 26px "Inter-Bold",sans-serif;`;
const Subtitle = styled.p`margin:0;color:#e5f6f7;font:400 14px/1.5 "Inter",sans-serif;`;
const Search = styled.label.attrs({ className: "search" })`height:46px;padding:0 14px;border-radius:8px;background:#fff;display:flex;align-items:center;gap:10px;color:#607679;input{width:100%;border:0;outline:0;color:#0c2427;font:500 13px "Inter-Medium",sans-serif;}`;
const SectionTitle = styled.h2`margin:0;color:#0c2427;font:600 16px "Inter-SemiBold",sans-serif;`;
const TopicGrid = styled.section`display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;@media(max-width:1000px){grid-template-columns:repeat(2,1fr);}@media(max-width:550px){grid-template-columns:1fr;}`;
const Topic = styled.article`padding:18px;border:1px solid #e0e3e6;border-radius:10px;background:#fff;display:flex;gap:13px;h3{margin:0 0 6px;font:600 14px "Inter-SemiBold",sans-serif;}p{margin:0;color:#718184;font:400 12px/1.5 "Inter",sans-serif;}`;
const TopicIcon = styled.div`flex:0 0 auto;width:38px;height:38px;border-radius:8px;background:#edf6f9;color:#066c78;display:grid;place-items:center;font-size:19px;`;
const ContentGrid = styled.section`display:grid;grid-template-columns:minmax(0,2fr) minmax(250px,1fr);gap:18px;align-items:start;@media(max-width:800px){grid-template-columns:1fr;}`;
const FaqCard = styled.div`padding:20px;border:1px solid #e0e3e6;border-radius:10px;background:#fff;`;
const FaqList = styled.div`margin-top:14px;border-top:1px solid #e8ebec;`;
const Faq = styled.div`border-bottom:1px solid #e8ebec;`;
const FaqButton = styled.button`width:100%;padding:16px 2px;border:0;background:transparent;color:#0c2427;display:flex;align-items:center;justify-content:space-between;gap:16px;text-align:left;font:600 13px "Inter-SemiBold",sans-serif;cursor:pointer;svg{flex:0 0 auto;transition:.2s;transform:rotate(${({ "aria-expanded": open }) => open ? "180deg" : "0"});}`;
const Answer = styled.p`margin:-4px 32px 16px 2px;color:#64777a;font:400 13px/1.65 "Inter",sans-serif;`;
const Empty = styled.p`margin:18px 2px;color:#718184;font-size:13px;`;
const SupportCard = styled.aside`padding:24px;border-radius:10px;background:#edf6f9;text-align:center;h2{margin:14px 0 8px;font:600 17px "Inter-SemiBold",sans-serif;}p{margin:0 0 18px;color:#64777a;font:400 13px/1.6 "Inter",sans-serif;}a{height:40px;padding:0 18px;border-radius:7px;background:#066c78;color:#fff;text-decoration:none;display:inline-flex;align-items:center;font:600 12px "Inter-SemiBold",sans-serif;}`;
const SupportIcon = styled.div`width:48px;height:48px;margin:auto;border-radius:50%;background:#fff;color:#066c78;display:grid;place-items:center;font-size:22px;`;
