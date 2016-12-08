<?php

namespace Edukodas\Bundle\TasksBundle\Controller;

use Edukodas\Bundle\TasksBundle\Entity\Course;
use Edukodas\Bundle\TasksBundle\Form\TaskListFilterType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class TaskListController extends Controller
{
    public function showListAction()
    {
        $course = $this->getDoctrine()->getRepository(Course::class)->getFirstCourse();

        $courseForm = $this->createForm(TaskListFilterType::class);

        $courseForm->get('course')->setData($course);

        if (!$courseForm->isValid()) {
            throw new HttpException(500);
        }

        return $this->render('@EdukodasTemplate/Task/taskList.html.twig', [
            'filterForm' => $courseForm->createView(),
            'course' => $course,
        ]);
    }

    public function getListAction($id)
    {
        $course = $this
            ->getDoctrine()
            ->getRepository(Course::class)
            ->find($id);

        if (!$course) {
            throw new NotFoundHttpException('Course not found.');
        }

        return $this->render('@EdukodasTemplate/Task/inc/_taskList.html.twig', [
            'course' => $course
        ]);
    }
}
