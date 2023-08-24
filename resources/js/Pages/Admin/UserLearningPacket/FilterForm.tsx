import { User } from '@/types';
import React, { useEffect, useState } from 'react';

interface Props {
  title: string;
  users: Array<User>;
  onFilter: (users: Array<User>) => void;
}

export default function FilterForm({ title, users, onFilter }: Props) {
  const [filterState, setFilterState] = useState({
    email: '',
    name: '',
    active_year: '',
  });
  useEffect(() => {
    const { email, name, active_year } = filterState;
    const filteredUnregistered = users.filter(it => {
      return (
        (it.email.toLowerCase().includes(email) || email == '') &&
        (it.name.toLowerCase().includes(name) || name == '') &&
        (`${it.active_year}`.includes(active_year) || active_year == '')
      );
    });
    onFilter(filteredUnregistered);
  }, [JSON.stringify(filterState)]);

  return (
    <div className="">
      <p className="text-xl">{title}</p>
      <div className="form-control w-full mt-4">
        <label htmlFor="name">Nama</label>
        <input
          type="text"
          className="mt-1 block w-full"
          onChange={e => {
            setFilterState({ ...filterState, name: e.target.value });
          }}
        />
      </div>
      <div className="form-control w-full mt-4">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          className="mt-1 block w-full"
          onChange={e => {
            setFilterState({ ...filterState, email: e.target.value });
          }}
        />
      </div>
      <div className="form-control w-full mt-4">
        <label htmlFor="active_year">Tahun Angkatan</label>
        <input
          type="number"
          placeholder="YYYY"
          min="1999"
          max={9999}
          className="mt-1 block w-full"
          value={filterState.active_year}
          onChange={e => {
            setFilterState({ ...filterState, active_year: e.target.value });
          }}
        />
      </div>
    </div>
  );
}
