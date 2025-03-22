import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User, Skill } from '../types';
import toast from 'react-hot-toast';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState({ title: '', description: '', proficiency_level: 'Beginner' });

  useEffect(() => {
    fetchUserData();
    fetchSkills();
  }, []);

  const fetchUserData = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (error) {
        toast.error('Error fetching user data');
        return;
      }
      setUser(data);
    }
  };

  const fetchSkills = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Error fetching skills');
        return;
      }
      setSkills(data || []);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    const { error } = await supabase
      .from('skills')
      .insert([
        {
          user_id: authUser.id,
          ...newSkill
        }
      ]);

    if (error) {
      toast.error('Error adding skill');
      return;
    }

    toast.success('Skill added successfully');
    setNewSkill({ title: '', description: '', proficiency_level: 'Beginner' });
    fetchSkills();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto"
    >
      {user && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
            <img
              src={user.avatar_url || `https://source.unsplash.com/random/800x200/?university`}
              alt="Profile cover"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative px-6 py-4">
            <div className="flex items-center">
              <div className="relative -mt-16">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg"
                />
              </div>
              <div className="ml-4 mt-2">
                <h1 className="text-2xl font-bold text-gray-900">{user.full_name}</h1>
                <p className="text-gray-600">{user.university} • {user.major}</p>
                <p className="text-gray-500">Class of {user.graduation_year}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Skills</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center text-indigo-600 hover:text-indigo-700"
              >
                <Plus className="h-5 w-5 mr-1" />
                Add Skill
              </button>
            </div>

            {isEditing && (
              <motion.form
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleAddSkill}
                className="mb-6 p-4 bg-gray-50 rounded-lg"
              >
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Skill Title"
                    value={newSkill.title}
                    onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                  <textarea
                    placeholder="Skill Description"
                    value={newSkill.description}
                    onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                  <select
                    value={newSkill.proficiency_level}
                    onChange={(e) => setNewSkill({ ...newSkill, proficiency_level: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                  >
                    Add Skill
                  </button>
                </div>
              </motion.form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{skill.title}</h3>
                    <span className="px-2 py-1 text-sm bg-indigo-100 text-indigo-800 rounded">
                      {skill.proficiency_level}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{skill.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}