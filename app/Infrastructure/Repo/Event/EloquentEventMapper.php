<?php namespace app\Infrastructure\Repo\Event;

/**
 * Created by Curious Minds Media.
 * Event: Andrew Engstrom (andrew@curiousm.com)
 * Date: 8/13/16
 * Time: 4:00 PM
 */

use app\Core\DomainEntity;
use app\Core\Event\Model\Event;
use app\Core\Event\Repository\EventInterface;
use app\Exceptions\ForbiddenException;
use app\Exceptions\InvalidRequestException;
use app\Infrastructure\AbstractEloquentMapper;
use app\Models\Opportunity;
use DateTime;

/**
 * Class EloquentEventMapper
 * @package app\Infrastructure\Repo\Event
 */
class EloquentEventMapper extends AbstractEloquentMapper implements EventInterface
{

    /**
     * @param $event
     *
     * @return mixed
     * @throws ForbiddenException
     * @throws InvalidRequestException
     */
    public function create($event)
    {
        try {
            $newEvent = $this->getQueryModel();
            $newEvent = $this->doStoreMapping($newEvent, $event, false);
            $newEvent->save();

            $tmpDate = DateTime::createFromFormat('m-d-Y', $newEvent->date);
            $newEvent->date = $tmpDate->format('m/d/Y');
            $newEvent->save();
        } catch (\PDOException $exception) {
            if ($exception->getCode() === 23505) {
                throw new InvalidRequestException('A event with this data already exists');
            }

            throw $exception;
        }

        $opportunity = Opportunity::where('id','=',$newEvent->opportunity_id)->first();
        switch($newEvent->type) {
            case 'quote':
                $opportunity->quote_date = $tmpDate;
                break;
            case 'approval':
                $opportunity->approval_date = $tmpDate;
                break;
            case 'sample':
                $opportunity->sample_date = $tmpDate;
                break;
            case 'production':
                $opportunity->date_rcvd_prod_order = $tmpDate;
                break;
            default:
                break;
        }
        $opportunity->save();

        $obj = $this->createObject($newEvent->toArray());

        return $obj;
    }

    /**
     * Updates an existing DomainEntity object and returns it
     *
     * @param DomainEntity $object
     *
     * @return DomainEntity
     * @throws ObjectNotFoundException
     * @throws \Exception
     */
    public function update(DomainEntity $object)
    {
        $model = $this->getQueryModel();
        $model = $model->where('id', '=', $object->getId())->first();

        if ($model === null) {
            throw new ObjectNotFoundException($this->targetClass(), $object->getId());
        }

        $model = $this->doStoreMapping($model, $object, true);
        $model->save();

        $tmpDate = DateTime::createFromFormat('m-d-Y', $model->date);
        $model->date = $tmpDate->format('m/d/Y');
        $model->save();

        $opportunity = Opportunity::where('id','=',$model->opportunity_id)->first();
        switch($model->type) {
            case 'quote':
                $opportunity->quote_date = $model->date;
                break;
            case 'approval':
                $opportunity->approval_date = $model->date;
                break;
            case 'sample':
                $opportunity->sample_date = $model->date;
                break;
            case 'production':
                $opportunity->date_rcvd_prod_order = $model->date;
                break;
            default:
                break;
        }
        $opportunity->save();

        $obj = $this->createObject($model->toArray());

        return $obj;
    }

    /**
     * Finds Events that contain this specific $opportunityId
     *
     * @param $opportunityId
     *
     * @return EventCollection
     */
    public function findByOpportunityId($opportunityId)
    {
        $result = $this->getQueryModel()
            ->where('opportunity_id', '=', intval($opportunityId))
            ->orderBy('id', 'asc')
            ->get();

        $responseArray = $result->toArray();

        return $this->getCollection($responseArray);
    }

    /**
     * Finds Events that contain this specific $opportunityId, paginated
     *
     * @param $opportunityId
     * @param $limit
     * @param $page
     *
     * @return EventCollection
     */
    public function findByOpportunityIdPaginated($opportunityId, $limit, $page)
    {
        $result = $this->getQueryModel()
            ->where('opportunity_id', '=', intval($opportunityId))
            ->orderBy('id', 'asc')
            ->paginate($limit);

        $collection = $this->getCollection($result->toArray()['data']);

        return $this->addMetaInfo($limit, $page, $result->total(), $collection);
    }

    /**
     * @return mixed
     */
    public function targetClass()
    {
        return Event::class;
    }
}
