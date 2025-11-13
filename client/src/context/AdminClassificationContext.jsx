import { createContext, useContext, useMemo, useState } from "react";

const initialSubjects = [
  {
    id: "s-1",
    name: "Mathematics",
    description: "The study of numbers, shapes, and patterns.",
    createdby: "Dr. Eleanor Vance",
    date: "01-10-2023",
  },
  {
    id: "s-2",
    name: "Physics",
    description: "The study of matter and energy and their interactions.",
    createdby: "Dr. Charles Bennett",
    date: "02-10-2023",
  },
  {
    id: "s-3",
    name: "Chemistry",
    description: "The study of substances and their properties and reactions.",
    createdby: "Dr. Olivia Carter",
    date: "03-10-2023",
  },
];

const initialTopics = [
  {
    id: "t-1",
    name: "Algebra",
    description: "Study of mathematical symbols and rules.",
    // subjectname: "Mathematics",
    createdby: "Dr. Eleanor Vance",
    date: "05-10-2023",
  },
  {
    id: "t-2",
    name: "Calculus",
    description: "Mathematical study of continuous change.",
    // subjectname: "Mathematics",
    createdby: "Dr. Eleanor Vance",
    date: "06-10-2023",
  },
  {
    id: "t-3",
    name: "Mechanics",
    description: "Study of motion and forces.",
    // subjectname: "Physics",
    createdby: "Dr. Charles Bennett",
    date: "07-10-2023",
  },
];

const initialSubtopics = [
  {
    id: "st-1",
    name: "Linear Equations",
    description: "Equations with variables of first degree.",
    // topicname: "Algebra",
    createdby: "Dr. Eleanor Vance",
    date: "08-10-2023",
  },
  {
    id: "st-2",
    name: "Quadratic Equations",
    description: "Equations with variables of second degree.",
    // topicname: "Algebra",
    createdby: "Dr. Eleanor Vance",
    date: "09-10-2023",
  },
  {
    id: "st-3",
    name: "Derivatives",
    description: "Rate of change of functions.",
    // topicname: "Calculus",
    createdby: "Dr. Eleanor Vance",
    date: "10-10-2023",
  },
];

const initialConcepts = [
  {
    id: "c-1",
    name: "Slope-Intercept Form",
    description: "y = mx + b representation of linear equations.",
    linkedsubtopic: "Linear Equations",
    // createdby: "Dr. Eleanor Vance",
    date: "11-10-2023",
  },
  {
    id: "c-2",
    name: "Standard Form",
    description: "Ax + By = C representation of linear equations.",
    linkedsubtopic: "Linear Equations",
    // createdby: "Dr. Eleanor Vance",
    date: "12-10-2023",
  },
  {
    id: "c-3",
    name: "Completing the Square",
    description: "Method for solving quadratic equations.",
    linkedsubtopic: "Quadratic Equations",
    // createdby: "Dr. Eleanor Vance",
    date: "13-10-2023",
  },
];

const AdminClassificationContext = createContext(undefined);

export const AdminClassificationProvider = ({ children }) => {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [topics] = useState(initialTopics);
  const [subtopics] = useState(initialSubtopics);
  const [concepts] = useState(initialConcepts);

  const addSubject = (payload) => {
    const id = `s-${Date.now()}`;
    const createdAt = new Date();

    const newSubject = {
      ...payload,
      id,
      dateCreated: createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
    };

    setSubjects((prev) => [newSubject, ...prev]);
    return newSubject;
  };

  const updateSubject = (id, updates) => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === id ? { ...subject, ...updates } : subject
      )
    );
  };

  const getSubjectById = (id) => subjects.find((s) => s.id === id) || null;

  const value = useMemo(
    () => ({
      subjects,
      topics,
      subtopics,
      concepts,
      addSubject,
      updateSubject,
      getSubjectById,
    }),
    [subjects, topics, subtopics, concepts]
  );

  return (
    <AdminClassificationContext.Provider value={value}>
      {children}
    </AdminClassificationContext.Provider>
  );
};

export const useAdminSubjects = () => {
  const context = useContext(AdminClassificationContext);
  if (!context) {
    throw new Error("useAdminSubjects must be used within AdminClassificationProvider");
  }
  return context;
};
