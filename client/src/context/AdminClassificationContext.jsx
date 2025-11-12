import React, { createContext, useContext, useMemo, useState } from "react";

const initialSubjects = [
  {
    id: "s-1",
    name: "Mathematics",
    description: "The study of numbers, shapes, and patterns.",
    createdBy: "Dr. Eleanor Vance",
    dateCreated: "01-10-2023",
  },
  {
    id: "s-2",
    name: "Physics",
    description: "The study of matter and energy and their interactions.",
    createdBy: "Dr. Charles Bennett",
    dateCreated: "02-10-2023",
  },
  {
    id: "s-3",
    name: "Chemistry",
    description: "The study of substances and their properties and reactions.",
    createdBy: "Dr. Olivia Carter",
    dateCreated: "03-10-2023",
  },
  {
    id: "s-4",
    name: "Biology",
    description: "The study of living organisms and their vital processes.",
    createdBy: "Dr. Samuel Davis",
    dateCreated: "04-10-2023",
  },
  {
    id: "s-5",
    name: "History",
    description: "The study of past events, particularly in human affairs.",
    createdBy: "Dr. Grace Evans",
    dateCreated: "05-10-2023",
  },
];

const AdminClassificationContext = createContext(undefined);

export const AdminClassificationProvider = ({ children }) => {
  const [subjects, setSubjects] = useState(initialSubjects);

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
      addSubject,
      updateSubject,
      getSubjectById,
    }),
    [subjects]
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
    throw new Error("useAdminSubjects must be used within an AdminClassificationProvider");
  }
  return context;
};
