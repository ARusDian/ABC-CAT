import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@/Components/CustomAccordion';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import ResourceEditor from '@/Components/ResourceEditor';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import { LearningMaterialModel } from '@/Models/LearningMaterial';
import TopicIcon from '@mui/icons-material/Topic';

import { Button } from '@mui/material';
import React from 'react';
import route from 'ziggy-js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { LearningCategoryModel } from '@/Models/LearningCategory';
import LinkButton from '@/Components/LinkButton';

interface Props {
  learning_category: LearningCategoryModel;
}

export default function Index({ learning_category: learningCategory }: Props) {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const learningMaterials = React.useMemo(
    () => learningCategory.learning_materials!,
    [learningCategory.learning_materials!],
  );

  const { learning_packet_id, sub_learning_packet_id, learning_category_id } =
    useDefaultClassificationRouteParams();

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <DashboardLayout title="Daftar Materi">
      <div className="flex flex-col gap-5 mx-10">
        <div className="flex justify-between">
          <p className="text-5xl text-[#3A63F5]">
            Daftar Materi {learningCategory.name}
          </p>
          <LinkButton
            href={route('student.packet.show', learning_packet_id)}
            colorCode="#3A63F5"
            className="px-5 rounded-md"
          >
            Kembali
          </LinkButton>
        </div>
        <div className="flex flex-col gap-3">
          {learningMaterials.length > 0 ? (
            learningMaterials.map((learningMaterial, i) => (
              <Accordion
                className="rounded-lg shadow-2xl"
                expanded={expanded === `panel${++i}`}
                onChange={handleChange(`panel${i}`)}
                key={i}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <p className="text-3xl">
                    <AssignmentIcon fontSize="large" />
                    <span className="pl-3 ">{learningMaterial.title}</span>
                  </p>
                </AccordionSummary>
                <AccordionDetails>
                  <div>
                    <div className="border-b-2 border-gray-200 p-5">
                      <p className="text-lg font-semibold">Deskripsi:</p>
                      <div className="prose ">
                        <ResourceEditor
                          content={learningMaterial.description.content}
                          disableEdit
                          editorClassName="h-full"
                        />
                      </div>
                    </div>
                    {learningMaterial.documents &&
                    learningMaterial.documents.length > 0 ? (
                      <ul className="p-3 flex flex-col gap-3">
                        {learningMaterial.documents.map((document, i) => (
                          <li className="flex gap-3 w-full" key={i}>
                            <div className="grid grid-cols-2 w-full">
                              <p className="text-xl my-auto">
                                <span className="pr-3">
                                  <TopicIcon fontSize="small" />
                                </span>
                                {i + 1}. {document.caption}
                              </p>
                              <div className="flex justify-around">
                                <LinkButton
                                  href={route(
                                    'student.packet.category.material.show',
                                    [
                                      learning_packet_id,
                                      sub_learning_packet_id,
                                      learning_category_id,
                                      document.id as unknown as string,
                                    ],
                                  )}
                                  colorCode="#3A63F5"
                                  className="w-full"
                                >
                                  Lihat Materi
                                </LinkButton>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex justify-center">
                        <p className="text-2xl font-semibold my-auto">
                          Tidak Ada Dokumen
                        </p>
                      </div>
                    )}
                  </div>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <div className="flex justify-center">
              <p className="text-3xl font-bold my-auto">Tidak Ada Materi</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
