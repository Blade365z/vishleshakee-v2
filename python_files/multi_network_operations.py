import warnings
warnings.filterwarnings("ignore", message="numpy.dtype size changed")
warnings.filterwarnings("ignore", message="numpy.ufunc size changed")

import networkx as nx
import pandas as pd
from networkx.algorithms import community
import json
import os
import csv
import itertools
from itertools import islice

class MultiNet():
	def generate_graph(self,path):
		self.edgelist = pd.read_csv(path,error_bad_lines=False)
		self.graph = nx.Graph()
		for i,elrow in self.edgelist.iterrows():
			# self.graph.add_edge(elrow[0], elrow[1],  attr_dict=elrow[2:].to_dict())
			self.graph.add_edge(elrow[0], elrow[1],weights=elrow[2])
		for i,elrow in self.edgelist.iterrows():
			self.graph.add_node(elrow[0])
			# print self.graph.edges(data=True)
		return self.graph



	def union(self, *args):
		for csv_path in args:
			new_list = csv_path

		if(len(new_list) < 2):
			print "Insuffienct Input"
			return 0
		else:
			go_list = []
			for i in new_list:
				go_list.append(self.generate_graph(i))
			result_go = nx.compose_all(go_list)
		return result_go.edges(data=True)


	def dummy_function(self, *args):
		print args
		print(type(args))
		for csv_path in args:
			new_list = csv_path
		print new_list
		print len(new_list)

		print "Printing lists exactly once"
		for i in new_list:
			print i 


	def difference(self, *args):
		for csv_path in args:
			new_list = csv_path

		if(len(new_list) < 2):
			print "Error Insufficient Input"
			return 0
		else:
			go_list = []
			temp = nx.Graph()
			counter=0
			for i in new_list:
				if(counter==0):
					temp = self.generate_graph(i)
					remember = temp
					counter=counter+1
				else:
					obtained_graph = self.generate_graph(i)
					variable =  temp.edges() - obtained_graph.edges()  
					temp = nx.Graph()
					temp.add_edges_from(variable)

			newresult = []
			for x in remember.edges(data=True):
				if(x[0],x[1]) in temp.edges():
					newresult.append(x)

			return newresult


	def intersection(self,*args):
		for csv_path in args:
			new_list = csv_path

		if(len(new_list) < 2):
			print "Error Insufficient Input"
			return 0
		else:
			counter=0
			graph1 = nx.Graph()
			graph2 = nx.Graph()
			for i in new_list:
				if(counter==0):
					graph1 = self.generate_graph(i)
					remember=graph1
					graph1_edges = graph1.edges(data=True)
					counter = counter + 1
				else:
					new_graph = nx.Graph()
					graph2 = self.generate_graph(i)

					graph2_edges = graph2.edges(data=True)
					new_graph.add_edges_from(graph1.edges() - (graph1.edges() - graph2.edges()))
					graph1 = new_graph

			newresult = []
			for x in remember.edges(data=True):
				if(x[0],x[1]) in new_graph.edges():
					newresult.append(x)
	
			return newresult


	def difference1(self, *args):
		for csv_path in args:
			new_list = csv_path

		if(len(new_list) < 2):
			print "Error Insufficient Input"
			return 0
		else:
			go_list = []
			temp = nx.Graph()
			counter=0
			for i in new_list:
				if(counter==0):
					temp = self.generate_graph(i)
					remember = temp
					counter=counter+1
				else:
					obtained_graph = self.generate_graph(i)
					variable =  temp.nodes() - obtained_graph.nodes()  
					temp = nx.Graph()
					temp.add_nodes_from(list(variable))
			return temp.nodes()

			

	def intersection1(self,*args):
		for csv_path in args:
			new_list = csv_path

		if(len(new_list) < 2):
			print "Error Insufficient Input"
			return 0
		else:
			counter=0
			graph1 = nx.Graph()
			graph2 = nx.Graph()
			for i in new_list:
				if(counter==0):
					graph1 = self.generate_graph(i)
					remember=graph1
					graph1_edges = graph1.edges(data=True)
					counter = counter + 1
				else:
					new_graph = nx.Graph()
					graph2 = self.generate_graph(i)
					graph2_edges = graph2.edges(data=True)
					new_graph.add_nodes_from(graph1.nodes() - (graph1.nodes() - graph2.nodes()))
					graph1 = new_graph

			return graph1.nodes()


	def community_using_async(self, *args):
		G = self.generate_graph(args[0])
		communities = community.asyn_fluidc(G,k=int(args[1]),max_iter=int(args[2]))
		return communities


	def path_finding(self, *args):
		G = self.generate_graph(args[0])
		try:
			path = nx.shortest_path(G,args[1],args[2])
			return path
		except:
			return -1


	def all_shortest_path(self, *args):
		G = self.generate_graph(args[0])
		try:
			path = nx.all_simple_paths(G, args[1], args[2])
			return path
		except:
			return -1


	def adamic_adar(self,*args):
		G = self.generate_graph(args[0])
		preds = nx.adamic_adar_index(G,[(args[1],args[2])])
		return preds


	def betweeness_centrality(self,args):
		G = self.generate_graph(args)
		btwn_centralities = nx.betweenness_centrality(G)
		return json.dumps(btwn_centralities)


	def evolution(self, *args):
		print args
		print(type(args))
		for csv_path in args:
			new_list = csv_path
		print new_list

		if(len(new_list) < 2):
			print "Insuffienct Input"
			return 0
		else:
			counter = 0
			data = []
			for i in new_list:
				if(counter == 0):
					temp  =  self.generate_graph(i)
					temp1 = self.generate_graph(i)
					counter=counter+1
				else:
					obtained_graph = self.generate_graph(i)
					variable =   obtained_graph.edges() - temp.edges()
					temp = nx.Graph()
					temp.add_edges_from(variable)

					data.append([obtained_graph.number_of_edges()])
					data.append(list(temp.nodes()))
					variable1 = temp1.edges() - obtained_graph.edges()
					temp1 = nx.Graph()
					temp1.add_edges_from(variable1)
					data.append(list(temp1.nodes()))
					print "Printing evolution"
					print data
					
	
			query="#roshan"
			dir_name = "osint/"
			path = "/var/www/html/front-end/storage/"+dir_name
			print path

			if((os.path.exists(path))):
				print "directory already exists writing to existing directory"
			else:
				os.mkdir(path)
				print "directory created successfully"

			filename=path+query+"evolution"+".csv"
			print filename

			with open(filename,'w') as csv_file:
				writer = csv.writer(csv_file)
				writer.writerows(data)


	def centrality(self, args):
		G = self.generate_graph(args)
		centralities = nx.degree_centrality(G)
		return json.dumps(centralities)
		# return centralities

	def eigenvector_centrality(self,*args):
		G = self.generate_graph(args[0])
		eigenvector_centrality = nx.eigenvector_centrality(G,max_iter=1000)
		return json.dumps(eigenvector_centrality)

	def common_neighbours(self,*args):
		G = self.generate_graph(args[0])
		print G
		commons = nx.common_neighbors(G,args[1],args[2]) 
		return sorted(commons) 

	def jaccard(self, *args):
		G = self.generate_graph(args[0])
		preds = nx.jaccard_coefficient(G,[(args[1],args[2])])
		return preds

	def pagerank(self, *args):
		G = self.generate_graph(args[0])
		pagerank = nx.pagerank(G)
		return json.dumps(pagerank)


	#multi network operations
	def adamic_adar_top_k(self, *args):
		G = self.generate_graph(args[0])

		edgelist = []
		for g in G.nodes():
			edgelist.append(tuple((args[1],g)))

		k = int(args[2])

		NewGraph = nx.Graph()
		NewGraph.add_edges_from(edgelist)
		
		preds = nx.adamic_adar_index(G,NewGraph.edges())

		list = []
		for i in preds:
			list.append(i)

		Sorted = self.Sort_Tuple(list)
		result = Sorted[:k]
		return result


	#multi network operations
	def Sort_Tuple(self,tup):  
		lst = len(tup)  
		for i in range(0, lst):  
			for j in range(0, lst-i-1):  
				if (tup[j][2] > tup[j + 1][2]):  
					temp = tup[j]  
					tup[j]= tup[j + 1]  
					tup[j + 1]= temp  
		return tup 


	def label_propagation(self, *args):
		G = self.generate_graph(args[0])

		edgelist = []
		for g in G.nodes():
			edgelist.append(tuple((args[1],g)))

		NewGraph = nx.Graph()
		NewGraph.add_edges_from(edgelist)

		G1 = nx.Graph()
		new_edges = G.edges() - NewGraph.edges() 
		G1.add_edges_from(new_edges)

		communities = community.label_propagation_communities(G1)
		return communities

	def grivan(self, *args):
		G = self.generate_graph(args[0])

		edgelist = []
		for g in G.nodes():
			edgelist.append(tuple((args[1],g)))

		NewGraph = nx.Graph()
		NewGraph.add_edges_from(edgelist)

		G1 = nx.Graph()
		new_edges = G.edges() - NewGraph.edges() 
		G1.add_edges_from(new_edges)

		communities = community.girvan_newman(G1)
		print communities
		print "Hello"
		return tuple(sorted(c) for c in next(communities))

	#multi_operations.py
	def jtk(self, *args):
		G1 = self.generate_graph(args[0])
		edgelist = []

		for g in G1.nodes():
			edgelist.append(tuple((args[1],g)))

		k = int(args[2])
		NewGraph = nx.Graph()
		NewGraph.add_edges_from(edgelist)

		preds = nx.jaccard_coefficient(G1,NewGraph.edges())
		list = []
		another_list = []
		for i in preds:
			temp = (i[0],i[1])
			another_list.append(temp)
			list.append(i)

		G2 = nx.Graph()
		G2.add_edges_from(another_list)
		G3 = G2.edges() - G1.edges()


		list3 = []
		for i in G3:
			for j in list:
				if((i[0]==j[0]) and (i[1]==j[1])):
					list3.append(j)
		
		Sorted = self.Sort_Tuple(list3)
		result = Sorted[:k]
		return result

	# In multi_network_operations.py
	def ksp(self,*args):
		G = self.generate_graph(args[0])
		source=args[1]
		target=args[2]
		k = int(args[3])
		arr = islice(nx.shortest_simple_paths(G,source,target), k)
		return arr

	# Bounded k for the path length
	def ksp1(self,*args):

		G = self.generate_graph(args[0])

		source=args[1]
		target=args[2]

		k = 6000

		number_of_hops = int(args[3])
		min_number_of_edges = int(args[4])

		answer = self.k_shortest_paths(G,source,target,k)

		new_list = []

		
		only_once = 0
		for i in answer:
			if(only_once == 0):
				j = len(i)
				j = j + 1
				new_list.append(i)
				only_once = 1
				# continue

			if((len(i) == j) and (j<=number_of_hops)):
				edges_this_loop = 0
				for i in answer:
					if((len(i)==j) and (edges_this_loop < min_number_of_edges)):
						new_list.append(i)
						edges_this_loop = edges_this_loop + 1
				
				j = j + 1

		# print new_list
		for i in new_list:
			print i  

		return new_list

		


	def k_shortest_paths(self,G,source,target,k):
		return list(islice(nx.shortest_simple_paths(G,source,target),k))

	def bfs(self,*args):
		G = self.generate_graph(args[0])
		nodelist = G.nodes();
		
		print "Printing the nodes"
		print nodelist
		
		print "Printing the edges"
		print G.edges()

		print "Hello Printing bfs"
		print list(nx.edge_bfs(G,nodelist))

		new_edges =  list(nx.bfs_edges(G,source=args[1],depth_limit=3))
		print new_edges
		new_Graph = nx.Graph()
		new_Graph.add_edges_from(new_edges)
		print list(islice(nx.shortest_simple_paths(new_Graph,args[1],args[2]),100))



	# Bounded k for the path length
	def ksp2(self,*args):
		print "I am in";
		G = self.generate_graph(args[0])
		source=args[1]
		target=args[2]

		# k = int(args[3])
		# k need to be hardcoded to 5000
		k = 6000

		# all nodes of depth has no meaning here
		all_nodes_of_depth = int(args[3]) + 1;
		# min_number_of_edges = int(args[5])

		answer = self.k_shortest_paths(G,source,target,k)

		new_list = []

		min = 2000;
		for i in answer:
			if(len(i) < min):
				min = len(i);


		for i in answer:
			if(len(i) == min):
				new_list.append(i)

		for i in new_list:
			print i  

		return new_list

		
 

