"use client";

import { useEffect, useState } from "react";

export default function AdminContactPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetch("/api/contact")
      .then(res => res.json())
      .then(data => {
        setContacts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch contacts:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this contact message?")) return;

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setContacts(contacts.filter(c => c._id !== id));
        setSelectedContact(null);
      } else {
        alert("Failed to delete contact");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Error deleting contact");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-gray-600 mt-2">Manage customer contact submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-orange-500">{contacts.length}</div>
          <div className="text-gray-600">Total Messages</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-blue-500">
            {contacts.filter(c => c.email).length}
          </div>
          <div className="text-gray-600">With Email</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-green-500">
            {contacts.filter(c => c.phone).length}
          </div>
          <div className="text-gray-600">With Phone</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-900">All Messages</h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedContact?._id === contact._id ? 'bg-orange-50 border-l-4 border-orange-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{contact.name || "Unknown"}</h3>
                  <span className="text-xs text-gray-500">
                    {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : "Recent"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{contact.subject || "No subject"}</p>
                <p className="text-xs text-gray-500 mt-1">{contact.email}</p>
              </div>
            ))}
            {contacts.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No contact messages yet
              </div>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border">
          {selectedContact ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedContact.name || "Unknown"}</h2>
                  <p className="text-gray-500">Contact Details</p>
                </div>
                <button
                  onClick={() => handleDelete(selectedContact._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-xs text-gray-500 uppercase">Email</label>
                  <p className="text-gray-900 font-medium">{selectedContact.email || "N/A"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-xs text-gray-500 uppercase">Phone</label>
                  <p className="text-gray-900 font-medium">{selectedContact.phone || "N/A"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                  <label className="text-xs text-gray-500 uppercase">Subject</label>
                  <p className="text-gray-900 font-medium">{selectedContact.subject || "No subject"}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase mb-2 block">Message</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                Submitted on: {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString() : "Unknown date"}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-lg">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
