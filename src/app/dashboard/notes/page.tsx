"use client";

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import styles from '../dashboard.module.css';
import { PlusIcon, TrashIcon, NotesIcon } from '@/components/Icons';

export default function NotesPage() {
  const { t, notes, addNote, deleteNote } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', color: '#fef3c7' });

  const colors = [
    '#fef3c7', // Yellow
    '#dcfce7', // Green
    '#dbeafe', // Blue
    '#fce7f3', // Pink
    '#f3f4f6', // Gray
  ];

  const handleCreateNote = () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return;
    addNote({
      ...newNote,
      date: new Date().toISOString(),
    });
    setNewNote({ title: '', content: '', color: '#fef3c7' });
    setIsAdding(false);
  };

  return (
    <div className={styles.dashboardContent}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{t.notes}</h1>
          <p className={styles.pageSubtitle}>{notes.length} ta eslatma</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAdding(!isAdding)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {isAdding ? t.cancel : <><PlusIcon size={18} /> Yangi eslatma</>}
        </button>
      </header>

      {isAdding && (
        <div className={styles.section} style={{ marginBottom: '2rem', animation: 'slideDown 0.3s ease-out' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Sarlavha..." 
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'var(--background)',
                color: 'var(--text-main)'
              }}
            />
            <textarea 
              placeholder="Eslatma matni..." 
              rows={4}
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                background: 'var(--background)',
                color: 'var(--text-main)',
                resize: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {colors.map(c => (
                  <button 
                    key={c}
                    onClick={() => setNewNote({ ...newNote, color: c })}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: c,
                      border: newNote.color === c ? '2px solid var(--primary)' : '1px solid #ddd',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleCreateNote}
                style={{ padding: '0.5rem 1.5rem' }}
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '1.5rem',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        {notes.length === 0 && !isAdding && (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '4rem 2rem', 
            background: 'var(--surface)', 
            borderRadius: '16px',
            border: '2px dashed var(--border)'
          }}>
            <NotesIcon size={48} />
            <p style={{ color: 'var(--text-secondary)' }}>Hozircha eslatmalar yo&apos;q. Birinchisini qo&apos;shing!</p>
          </div>
        )}
        
        {notes.map((note) => (
          <div 
            key={note.id}
            style={{
              background: note.color,
              padding: '1.5rem',
              borderRadius: '16px',
              position: 'relative',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s',
              cursor: 'default',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '180px',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <button 
              onClick={() => deleteNote(note.id)}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                background: 'rgba(255,255,255,0.5)',
                border: 'none',
                borderRadius: '50%',
                padding: '6px',
                cursor: 'pointer',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.8
              }}
            >
              <TrashIcon size={16} />
            </button>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.75rem', paddingRight: '20px' }}>
              {note.title || 'Sarlavhasiz'}
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.4', flex: 1, whiteSpace: 'pre-wrap' }}>
              {note.content}
            </p>
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>
              {new Date(note.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
