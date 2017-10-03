// K-Means clustering algorithm with partial information.
// By Isak C. Etinger.

#include <iostream>
#include <vector>
#include <math.h>
#include <stdlib.h>
#include <time.h>
#include <algorithm>
#include <cstdio>

using namespace std;

class Point
{
private:
	int id_point, id_cluster;
	vector<double> values; // +1.0 means question answered correctly. -1.0 means incorrectly. 0.0 means question not answered.
	int total_values;
	string name;

public:
	Point(int id_point, vector<double>& values, string name = "")
	{
		this->id_point = id_point;
		total_values = values.size();

		for (int i = 0; i < total_values; ++i)
			this->values.push_back(values[i]);

		this->name = name;
		id_cluster = -1;
	}

	int getID()
	{
		return id_point;
	}

	void setCluster(int id_cluster)
	{
		this->id_cluster = id_cluster;
	}

	int getCluster()
	{
		return id_cluster;
	}

	double getValue(int index)
	{
		return values[index];
	}

	int getTotalValues()
	{
		return total_values;
	}

	void addValue(double value)
	{
		values.push_back(value);
	}

	string getName()
	{
		return name;
	}
};

class Cluster
{
private:
	int id_cluster;
	vector<double> central_values;
	vector<double> representation_of_values; // fraction of points in the cluster that have meaningful values (+1.0 or -1.0)
	                                         // = 1.0 means all points in the cluster have meaningful values (+1.0 or -1.0). 
	vector<Point> points;

public:
	Cluster(int id_cluster, Point point)
	{
		this->id_cluster = id_cluster;

		int total_values = point.getTotalValues();

		for (int i = 0; i < total_values; ++i) {
			central_values.push_back(point.getValue(i));
			representation_of_values.push_back(point.getValue(i) == 0.0 ? 0.0 : 1.0); 
			// initially central values have each coordinate representation equal to:
			// 0.0 if the coordinate was meaningless (0.0), and 1.0 if it was meaningful (1.0 or -1.0). 
		}
		
		points.push_back(point);
	}

	void addPoint(Point point)
	{
		points.push_back(point);
	}

	bool removePoint(int id_point)
	{
		int total_points = points.size();

		for (int i = 0; i < total_points; ++i)
		{
			if (points[i].getID() == id_point)
			{
				points.erase(points.begin() + i);
				return true;
			}
		}
		return false;
	}

	double getCentralValue(int index)
	{
		return central_values[index];
	}

	double getRepresentationOfValue(int index)
	{
		return representation_of_values[index];
	}

	void setCentralValue(int index, double value)
	{
		central_values[index] = value;
	}

	void setRepresentationOfValue(int index, double value)
	{
		representation_of_values[index] = value;
	}

	Point getPoint(int index)
	{
		return points[index];
	}

	int getTotalPoints()
	{
		return points.size();
	}

	int getID()
	{
		return id_cluster;
	}
};


static double square(double x) { return x * x; }

// returns the distance between a point and a centroid of a cluster weighted by the representation_of_value of each coordinate considered.
static double dist_a(Point p, Cluster c)
{
	double tmp = 0.0, totalWeight = 0.0;
	for (int i = 0, total = p.getTotalValues(); i < total; ++i) 
	{
		if (p.getValue(i) != 0.0) // if the value considered is meaningful 
		{
			tmp += square(c.getRepresentationOfValue(i) * (p.getValue(i) - c.getCentralValue(i))); // weighted by the "meaningfulness" of the value.
			totalWeight += square(c.getRepresentationOfValue(i));
		}
	}
	return sqrt(tmp) / totalWeight;
}

class KMeans
{
private:
	int K; // number of clusters
	int total_values, total_points, max_iterations;
	vector<Cluster> clusters;

	// return ID of nearest center (uses distance defined above)
	int getIDNearestCenter(Point point)
	{
		double min_dist;
		int id_cluster_center = 0;
		min_dist = dist_a(point, clusters[0]);
		for (int i = 1; i < K; i++)
		{
			double dist = dist_a(point, clusters[i]);
			if (dist < min_dist)
			{
				min_dist = dist;
				id_cluster_center = i;
			}
		}
		return id_cluster_center;
	}

public:
	KMeans(int K, int total_points, int total_values, int max_iterations)
	{
		this->K = K;
		this->total_points = total_points;
		this->total_values = total_values;
		this->max_iterations = max_iterations;
	}

	void run(vector<Point> & points)
	{
		if (K > total_points)
			return;

		vector<int> prohibited_indexes;

		// choose K distinct values for the centers of the clusters
		for (int i = 0; i < K; ++i)
		{
			while (true)
			{
				int index_point = rand() % total_points;

				if (find(prohibited_indexes.begin(), prohibited_indexes.end(),
					index_point) == prohibited_indexes.end())
				{
					prohibited_indexes.push_back(index_point);
					points[index_point].setCluster(i);
					Cluster cluster(i, points[index_point]);
					clusters.push_back(cluster);
					break;
				}
			}
		}

		int iter = 1;

		while (true)
		{
			bool done = true;

			// associates each point to the nearest center
			for (int i = 0; i < total_points; ++i)
			{
				int id_old_cluster = points[i].getCluster();
				int id_nearest_center = getIDNearestCenter(points[i]);

				if (id_old_cluster != id_nearest_center)
				{
					if (id_old_cluster != -1)
						clusters[id_old_cluster].removePoint(points[i].getID());

					points[i].setCluster(id_nearest_center);
					clusters[id_nearest_center].addPoint(points[i]);
					done = false;
				}
			}

			// recalculating the center of each cluster,
			// both the central value coordinates and their representation. 
			for (int i = 0; i < K; ++i) // for each cluster (with index i).
			{
				for (int j = 0; j < total_values; ++j) // for each of the coordinates (with index j).
				{
					int total_points_cluster = clusters[i].getTotalPoints(), total_points_with_meaningful_coordinate = 0;
					double sum = 0.0;

					if (total_points_cluster > 0)
					{
						for (int p = 0; p < total_points_cluster; ++p) // for each point (with index p) in the cluter.
						{
							sum += clusters[i].getPoint(p).getValue(j);
							if (clusters[i].getPoint(p).getValue(j) != 0.0)
								++total_points_with_meaningful_coordinate;
						}
						clusters[i].setCentralValue(j, sum / total_points_with_meaningful_coordinate);
						clusters[i].setRepresentationOfValue(j, 1.0 * total_points_cluster / total_points_with_meaningful_coordinate);
						// the representation of a coordinate is the fraction of the points which have that coordinate meaningfull
						// over all points that have that coordinate.
					}
				}
			}

			if (done == true || iter >= max_iterations)
			{
				cout << "Break in iteration " << iter << "\n\n";
				break;
			}

			++iter;
		}

		// get elements of clusters
		int cluster_of_each_point[total_points];
		for (int i = 0; i < K; ++i)
		{
			for (int j = 0, total_points_cluster = clusters[i].getTotalPoints(); j < total_points_cluster; ++j)
			{
				// the cluster of the point with index clusters[i].getPoint(j).getID() is clusters[i].getID()
				cluster_of_each_point[clusters[i].getPoint(j).getID()] = clusters[i].getID();
			}
		}

		// uncomment for debugging:
		// prints out an array in JSON format.
		// "[a,b,c]" means the cluster of point 0 is a, cluster of point 1 is b, and cluster of point 2 is c.
		/*
		cout << "[" << cluster_of_each_point[0];
		for (unsigned i = 1; i < total_points; ++i) {
			cout << "," << cluster_of_each_point[i];
		}
		cout << "]";
		*/

		// uncomment for debugging: 
		// prints out the points contained by each cluster and the centrality points of each cluster.
		// Additionally, it shows the points' names for those which have them.
		/*
		for (int i = 0; i < K; ++i)
		{
			int total_points_cluster = clusters[i].getTotalPoints();

			cout << "Cluster " << clusters[i].getID() + 1 << endl;
			for (int j = 0; j < total_points_cluster; j++)
			{
				cout << "Point " << clusters[i].getPoint(j).getID() + 1 << ": ";
				for (int p = 0; p < total_values; p++)
					cout << clusters[i].getPoint(j).getValue(p) << " ";

				string point_name = clusters[i].getPoint(j).getName();

				if (point_name != "")
					cout << "- " << point_name;

				cout << endl;
			}

			cout << "Cluster values: ";

			for (int j = 0; j < total_values; j++)
				cout << clusters[i].getCentralValue(j) << " ";

			cout << "\n\n";
		}
		*/
	}
};

int main(int argc, char *argv[])
{
	srand(time(NULL));

	int total_points, total_values, K, max_iterations, has_name;

	/*
	Input format:
	[
		A,
		B,
		C,
		D,
		[
			// each of those arrays represent a question.
			[1.0,0.0,0.0,1.0],		// a element of the array represents a user. 1.0 means users answered correctly the question. -1.0 means incorrectly. 0.0 means not answered.
			[-1.0,-1.0,1.0,1.0],
			[-1.0,0.0,0.0,-1.0],
			[-1.0,0.0,0.0,1.0]
		]
	]
	where
	"A" is the amount of questions.
	"B" is the amount of users.
	"C" is the amount of clusters.
	"D" is the maximum iterations.
	
	Ignores blank spaces and end-lines.
	A,B,C,D are integers.
	All other numbers are stored in doubles.
	*/

	//cin >> total_points >> total_values >> K >> max_iterations >> has_name;
	scanf(" %*c %d %*c %d %*c %d %*c %d %*c %*c", &total_points, &total_values, &K, &max_iterations);
	
	vector<Point> points;

	for (int i = 0; i < total_points; ++i)
	{
		vector<double> values;
		for (int j = 0; j < total_values; ++j)
		{
			double value;
			scanf(" %*c %lf", &value); // throws away a '[' when j = 0. Else throws away a ','.
			values.push_back(value);
		}
		Point p(i, values);
		points.push_back(p);
		scanf(" %*c %*c"); // throws away a ']' and a ','.
	}

	KMeans kmeans(K, total_points, total_values, max_iterations);
	kmeans.run(points);

	return 0;
}
