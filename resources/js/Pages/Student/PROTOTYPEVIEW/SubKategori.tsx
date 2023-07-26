import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@/Components/CustomAccordion';
import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import { Assignment, ExpandMore } from '@mui/icons-material';
import { Button } from '@mui/material';
import React from 'react';

export default function SubKategori() {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <DashboardLayout title="SubKategori">
      <div className="flex flex-col gap-5 mx-10">
        <div className="text-5xl text-[#3A63F5]">KATEGORI MATERI</div>
        <div className="flex flex-col gap-3">
          <Accordion
            className="rounded-lg shadow-2xl"
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <p className="text-3xl">
                <Assignment fontSize="large" />
                <span className="pl-3 ">Seleksi Kompetensi Dasar (SKD)</span>
              </p>
            </AccordionSummary>
            <AccordionDetails>
              <ul className="p-3 flex flex-col gap-3">
                <li className="flex gap-3 w-full">
                  <div className="grid grid-cols-2 w-full">
                    <p className="text-xl my-auto">
                      <span className="pr-3">
                        <Assignment fontSize="small" />
                      </span>
                      1. Tes Wawasan Kebangsaan
                    </p>
                    <div className="flex justify-around">
                      <Button variant="contained" color="primary" size="large">
                        Materi
                      </Button>
                      <Button variant="contained" color="success" size="large">
                        Latihan
                      </Button>
                    </div>
                  </div>
                </li>
                <li className="flex gap-3 w-full">
                  <div className="grid grid-cols-2 w-full">
                    <p className="text-xl my-auto">
                      <span className="pr-3">
                        <Assignment fontSize="small" />
                      </span>
                      2. Tes Intelegensia Umum
                    </p>
                    <div className="flex justify-around">
                      <Button variant="contained" color="primary" size="large">
                        Materi
                      </Button>
                      <Button variant="contained" color="success" size="large">
                        Latihan
                      </Button>
                    </div>
                  </div>
                </li>
                <li className="flex gap-3 w-full">
                  <div className="grid grid-cols-2 w-full">
                    <p className="text-xl my-auto">
                      <span className="pr-3">
                        <Assignment fontSize="small" />
                      </span>
                      3. Tes Karakteristik Pribadi
                    </p>
                    <div className="flex justify-around">
                      <Button variant="contained" color="primary" size="large">
                        Materi
                      </Button>
                      <Button variant="contained" color="success" size="large">
                        Latihan
                      </Button>
                    </div>
                  </div>
                </li>
              </ul>
            </AccordionDetails>
          </Accordion>
          <Accordion
            className="rounded-lg shadow-2xl"
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <p className="text-3xl">
                <Assignment fontSize="large" />
                <span className="pl-3 ">Bahasa Inggris</span>
              </p>
            </AccordionSummary>
            <AccordionDetails>
              <ul className="p-3 flex flex-col gap-3">
                <li className="flex gap-3 w-full">
                  <div className="grid grid-cols-2 w-full">
                    <p className="text-xl my-auto">
                      <span className="pr-3">
                        <Assignment fontSize="small" />
                      </span>
                      1. Tes Wawasan Kebangkasaan
                    </p>
                    <div className="flex justify-around">
                      <Button variant="contained" color="primary" size="large">
                        Materi
                      </Button>
                      <Button variant="contained" color="success" size="large">
                        Latihan
                      </Button>
                    </div>
                  </div>
                </li>
                <li className="flex gap-3 w-full">
                  <div className="grid grid-cols-2 w-full">
                    <p className="text-xl my-auto">
                      <span className="pr-3">
                        <Assignment fontSize="small" />
                      </span>
                      2. Tes Intelegensia Umum
                    </p>
                    <div className="flex justify-around">
                      <Button variant="contained" color="primary" size="large">
                        Materi
                      </Button>
                      <Button variant="contained" color="success" size="large">
                        Latihan
                      </Button>
                    </div>
                  </div>
                </li>
                <li className="flex gap-3 w-full">
                  <div className="grid grid-cols-2 w-full">
                    <p className="text-xl my-auto">
                      <span className="pr-3">
                        <Assignment fontSize="small" />
                      </span>
                      3. Tes Karakteristik Pribadi
                    </p>
                    <div className="flex justify-around">
                      <Button variant="contained" color="primary" size="large">
                        Materi
                      </Button>
                      <Button variant="contained" color="success" size="large">
                        Latihan
                      </Button>
                    </div>
                  </div>
                </li>
              </ul>
            </AccordionDetails>
          </Accordion>
          <Accordion
            className="rounded-lg shadow-2xl"
            expanded={expanded === 'panel3'}
            onChange={handleChange('panel3')}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <p className="text-3xl">
                <Assignment fontSize="large" />
                <span className="pl-3 ">Psikologi</span>
              </p>
            </AccordionSummary>
            <AccordionDetails>
              <ul className="p-3 flex flex-col gap-3">
                <li className="flex gap-3 w-full">
                  <div className="grid grid-cols-2 w-full">
                    <p className="text-xl my-auto">
                      <span className="pr-3">
                        <Assignment fontSize="small" />
                      </span>
                      1. Tes Wawasan Kebangkasaan
                    </p>
                    <div className="flex justify-around">
                      <Button variant="contained" color="primary" size="large">
                        Materi
                      </Button>
                      <Button variant="contained" color="success" size="large">
                        Latihan
                      </Button>
                    </div>
                  </div>
                </li>
                <li className="flex gap-3 w-full">
                  <div className="grid grid-cols-2 w-full">
                    <p className="text-xl my-auto">
                      <span className="pr-3">
                        <Assignment fontSize="small" />
                      </span>
                      2. Tes Intelegensia Umum
                    </p>
                    <div className="flex justify-around">
                      <Button variant="contained" color="primary" size="large">
                        Materi
                      </Button>
                      <Button variant="contained" color="success" size="large">
                        Latihan
                      </Button>
                    </div>
                  </div>
                </li>
                <li className="flex gap-3 w-full">
                  <div className="grid grid-cols-2 w-full">
                    <p className="text-xl my-auto">
                      <span className="pr-3">
                        <Assignment fontSize="small" />
                      </span>
                      3. Tes Karakteristik Pribadi
                    </p>
                    <div className="flex justify-around">
                      <Button variant="contained" color="primary" size="large">
                        Materi
                      </Button>
                      <Button variant="contained" color="success" size="large">
                        Latihan
                      </Button>
                    </div>
                  </div>
                </li>
              </ul>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </DashboardLayout>
  );
}
